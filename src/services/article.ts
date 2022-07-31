import sentenceParseNew2SentenceParseProps from 'sentence-parse-new2sentence-parse-props';
import accentsForPitchesArray from 'accents-for-pitches-array';
import {
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  updateDoc,
  where,
} from 'firebase/firestore';
import {
  Article,
  ArticleCard,
  ArticleCardsState,
  ArticleSentenceForm,
  ArticleState,
  AssignmentBlobs,
  AssignmentSentence,
  INITIAL_ARTICLE_STATE,
  Sentence,
  SentenceParseNew,
  SentenceParseProps,
} from '../Model';
import { db, storage } from '../repositories/firebase';
import { getDownloadURL, ref } from 'firebase/storage';

const COLLECTIONS = {
  articles: 'articles',
  sentences: 'sentences',
  aSentences: 'aSentences',
  assignments: 'assignments',
  sentenceParseNews: 'sentenceParseNews',
  articleSentenceForms: 'articleSentenceForms',
};

const HIT_MAX = 20;

export const getArticleState = async (
  uid: string,
  articleId: string
): Promise<ArticleState> => {
  // article
  console.log('get article');
  let docSnapshot = await getDoc(doc(db, COLLECTIONS.articles, articleId));
  if (!docSnapshot.exists()) {
    return INITIAL_ARTICLE_STATE;
  }
  const article = buildArticle(docSnapshot);

  // sentences
  let q = query(
    collection(db, COLLECTIONS.sentences),
    where('article', '==', articleId),
    orderBy('line')
  );
  console.log('get sentences');
  let querySnapshot = await getDocs(q);
  const sentences: Sentence[] = [];
  querySnapshot.forEach((doc) => {
    sentences.push(buildSentence(doc));
  });

  // articleBlob
  const { downloadURL } = article;
  console.log('create article audio');
  let response = await fetch(downloadURL);
  const articleBlob = await response.blob();

  // assignmentBlob
  // assignmentDownloadURL
  let assignmentDownloadURL = '';
  q = query(
    collection(db, COLLECTIONS.assignments),
    where('article', '==', articleId),
    where('uid', '==', uid)
  );
  console.log('get assignments');
  querySnapshot = await getDocs(q);
  const first = querySnapshot.docs[0];
  if (first) {
    assignmentDownloadURL = first.data().downloadURL;
  }

  console.log('create assignment audio');
  response = await fetch(assignmentDownloadURL);

  const assignmentBlob = await response.blob();

  // assignmentBlobs
  const assignmentBlobs: AssignmentBlobs = {};
  await Promise.all(
    sentences.map(async (sentence) => {
      const { id, storagePath } = sentence;
      if (!!storagePath) {
        // ダウンロード URL を取得
        const url = await getDownloadURL(ref(storage, storagePath));
        console.log('create assignmentAudio');
        // HTTP レスポンスを取得
        const response = await fetch(url);
        // HTTP レスポンス全体から Blob を取得
        const blob = await response.blob();
        assignmentBlobs[id] = blob;
      }
    })
  );

  // articleAssignmentSentences
  const articleAssignmentSentences: AssignmentSentence[] = [];
  q = query(
    collection(db, COLLECTIONS.aSentences),
    where('article', '==', articleId),
    where('uid', '==', uid),
    orderBy('line')
  );
  console.log('get assignments');
  querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    articleAssignmentSentences.push(buildAssignmentSentence(doc));
  });

  // sentenceParseProps
  const sentenceParseProps: { [sentenceId: string]: SentenceParseProps } = {};
  q = query(
    collection(db, COLLECTIONS.sentenceParseNews),
    where('article', '==', articleId)
  );
  console.log('get sentenceParses ');
  querySnapshot = await getDocs(q);
  const sentenceParseNews: { [key: string]: SentenceParseNew } = {};

  querySnapshot.forEach((doc) => {
    const sentenceParseNew: SentenceParseNew = {
      units: doc.data().units,
      words: doc.data().words,
      branches: doc.data().branches,
      sentences: doc.data().sentences,
      sentenceArrays: doc.data().sentenceArrays,
    };
    sentenceParseNews[doc.data().sentence] = sentenceParseNew;
  });

  for (const [sentenceId, sentenceParseNew] of Object.entries(
    sentenceParseNews
  )) {
    sentenceParseProps[sentenceId] = sentenceParseNew2SentenceParseProps({
      units: JSON.parse(sentenceParseNew.units),
      words: JSON.parse(sentenceParseNew.words),
      branches: JSON.parse(sentenceParseNew.branches),
      sentences: JSON.parse(sentenceParseNew.sentences),
      sentenceArrays: JSON.parse(sentenceParseNew.sentenceArrays),
    });
  }

  // articleSentenceForms
  const articleSentenceForms: ArticleSentenceForm[] = [];
  q = query(
    collection(db, COLLECTIONS.articleSentenceForms),
    where('articleId', '==', articleId),
    orderBy('lineIndex')
  );
  console.log('get sentenceForms');
  querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    articleSentenceForms.push(buildArticleSentenceForm(doc));
  });

  return {
    article,
    sentences,
    articleBlob,
    assignmentBlob,
    assignmentBlobs,
    assignmentDownloadURL,
    articleAssignmentSentences,
    sentenceParseProps,
    articleSentenceForms,
  };
};

export const updateSentence = async (
  sentenceId: string,
  storagePath: string,
  storageDuration: number
) => {
  try {
    console.log('update sentence');
    updateDoc(doc(db, COLLECTIONS.sentences, sentenceId), {
      storagePath,
      storageDuration,
    });
  } catch (e) {
    console.warn(e);
  }
};

export const getArticleCards = async (
  uid: string,
  rows: number,
  _startAfter?: number
): Promise<ArticleCardsState> => {
  const cards: ArticleCard[] = [];
  const createdAts: number[] = [];
  let q = query(
    collection(db, COLLECTIONS.articles),
    where('uid', '==', uid),
    orderBy('createdAt', 'desc'),
    limit(rows + 1)
  );

  if (!!_startAfter) {
    q = query(q, startAfter(_startAfter));
  }
  console.log('get articles');
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    const { id } = doc;
    const { title, createdAt } = doc.data();
    const card = buildCard(id, title, createdAt);
    cards.push(card);
    createdAts.push(createdAt);
  });

  const hasMore = cards.length === rows + 1;
  if (hasMore) {
    cards.pop();
    createdAts.pop();
  }

  return { cards, hasMore, startAfter: createdAts.slice(-1)[0] };
};

const buildArticle = (doc: DocumentData) => {
  const {
    uid,
    marks,
    title,
    embedID,
    createdAt,
    isShowParse,
    downloadURL,
    hasRecButton,
    isShowAccents,
  } = doc.data();
  const article: Article = {
    id: doc.id,
    uid: uid || '',
    marks: marks || [],
    title: title || '',
    embedID: embedID || '',
    createdAt: createdAt || 0,
    isShowParse: isShowParse || false,
    downloadURL: downloadURL || '',
    hasRecButton: hasRecButton || false,
    isShowAccents: isShowAccents || false,
  };
  return article;
};

const buildSentence = (doc: DocumentData) => {
  const {
    end,
    line,
    kana,
    title,
    start,
    chinese,
    article,
    japanese,
    original,
    createdAt,
    accents,
    storagePath,
    storageDuration,
  } = doc.data();
  const sentence: Sentence = {
    id: doc.id,
    end: end || 0,
    line: line || 0,
    kana: kana || '',
    title: title || '',
    start: start || '',
    chinese: chinese || '',
    article: article || '',
    japanese: japanese || '',
    original: original || '',
    createdAt: createdAt || 0,
    pitchesArray: accentsForPitchesArray(accents),
    storagePath: storagePath || '',
    storageDuration: storageDuration || 0,
  };
  return sentence;
};

const buildAssignmentSentence = (doc: DocumentData) => {
  const { end, start, accents } = doc.data();
  const assignmentSentence: AssignmentSentence = {
    end: end || 0,
    start: start || 0,
    pitchesArray: accentsForPitchesArray(accents),
  };
  return assignmentSentence;
};

export const INITIAL_ASSIGNMENT_SENTENCE: AssignmentSentence = {
  end: 0,
  start: 0,
  pitchesArray: [],
};

const buildArticleSentenceForm = (doc: DocumentData) => {
  const { articleId, lineIndex, sentences } = doc.data();
  const articleSentenceForm: ArticleSentenceForm = {
    id: doc.id || '',
    articleId: articleId || '',
    lineIndex: lineIndex || 0,
    sentences: sentences || {},
  };
  return articleSentenceForm;
};

const buildCard = (id: string, title: string, createdAt: number) => {
  const date = new Date(createdAt);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const card: ArticleCard = {
    id,
    title: title || '',
    date: `${year}年${month}月${day}日`,
  };
  return card;
};

export const getSentencesByTags = async (
  uid: string,
  keywords: string[]
): Promise<Sentence[]> => {
  const sentences: Sentence[] = [];
  const tags: string[] = [];
  keywords.forEach((keyword) => {
    if (keyword.length === 1) {
      tags.push(keyword);
    } else {
      Array.from(keyword).forEach((_, i) => {
        if (i + 1 < keyword.length) {
          tags.push(keyword.slice(i, i + 2));
        }
      });
    }
  });
  if (!tags.length) return [];
  let q = query(collection(db, COLLECTIONS.sentences));
  tags.forEach((tag) => {
    q = query(q, where(`tags.${tag}`, '==', true));
  });
  q = query(q, where('uid', '==', uid), limit(HIT_MAX));

  console.log('get sentences');
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    sentences.push(buildSentence(doc));
  });

  return sentences;
};
