import {
  collection,
  DocumentData,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { ISentence } from '../core/0-interface';
import { SENTENCE_STORE_COLLECTION } from '../core/1-constants';
import { db } from 'infrastructure/firebase';
import accentsForPitchesArray from 'accents-for-pitches-array';
import pitchesArray2String from 'pitches-array2string';

export const fetchSentences = async (
  articleId: string
): Promise<{ [id: string]: ISentence }> => {
  console.log(`%cfetch ${SENTENCE_STORE_COLLECTION}`, 'color:red');

  const q = query(
    collection(db, SENTENCE_STORE_COLLECTION),
    where('article', '==', articleId)
  );

  const querySnapshot = await getDocs(q);
  const sentences: { [id: string]: ISentence } = {};
  querySnapshot.forEach((doc) => {
    const sentence = buildSentence(doc);
    sentences[sentence.id] = sentence;
  });

  return sentences;
};

const buildSentence = (doc: DocumentData): ISentence => {
  const { end, line, start, chinese, article, japanese, original, accents } =
    doc.data();
  const pitchesArray = accentsForPitchesArray(accents);
  const pitchStr = pitchesArray2String(pitchesArray);
  const sentence: ISentence = {
    id: doc.id,
    end: end || 0,
    line: line || 0,
    start: start || '',
    chinese: chinese || '',
    articleId: article || '',
    japanese: japanese || '',
    original: original || '',
    pitchStr: pitchStr || '',
  };
  return sentence;
};
