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
  ArticleListParams,
  ArticleState,
  AssignmentBlobs,
  INITIAL_ARTICLE_LIST_PARAMS,
  INITIAL_ARTICLE_STATE,
  Sentence,
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
  let { downloadURL } = article;
  if (downloadURL) {
    const header = downloadURL.slice(0, 4);
    if (header !== 'http') {
      downloadURL = await getDownloadURL(ref(storage, downloadURL));
    }
  }
  console.log('create article audio');

  let response = await fetch(downloadURL);
  const articleBlob = await response.blob();

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

  return {
    article,
    sentences,
    articleBlob,
    assignmentBlobs,
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
): Promise<{
  articleCards: ArticleCardsState;
  articles: Article[];
  params: ArticleListParams;
}> => {
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
  const articles: Article[] = [];
  querySnapshot.forEach((doc) => {
    articles.push(buildArticle(doc));
    const { id } = doc;
    const { title, createdAt } = doc.data();
    const card = buildCard(id, title, createdAt);
    cards.push(card);
    createdAts.push(createdAt);
  });

  const params = {
    ...INITIAL_ARTICLE_LIST_PARAMS,
    hasMore: cards.length === rows + 1,
    startAfter: cards.length === rows + 1 ? createdAts.slice(-2)[0] : 0,
  };

  const hasMore = cards.length === rows + 1;
  params.hasMore = cards.length === rows + 1;
  if (hasMore) {
    cards.pop();
    createdAts.pop();
    articles.pop();
  }

  return {
    articleCards: { cards, hasMore, startAfter: createdAts.slice(-1)[0] },
    articles,
    params,
  };
};

const buildArticle = (doc: DocumentData) => {
  const { uid, marks, title, embedID, createdAt, downloadURL, isShowAccents } =
    doc.data();
  const article: Article = {
    id: doc.id,
    uid: uid || '',
    marks: marks || [],
    title: title || '',
    embedID: embedID || '',
    createdAt: createdAt || 0,
    downloadURL: downloadURL || '',
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
