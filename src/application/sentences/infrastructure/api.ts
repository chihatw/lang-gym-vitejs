import {
  collection,
  DocumentData,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { ISentence } from '../core/0-interface';

import { db } from 'infrastructure/firebase';

import { accentsForPitchesArray } from 'application/utils/accentsForPitchesArray';
import { pitchesArray2String } from 'application/utils/pitchesArray2String';

const COLLECTION = 'sentences';

export const fetchSentences = async (
  articleId: string
): Promise<ISentence[]> => {
  console.log(`%cfetch ${COLLECTION}`, 'color:red');

  const q = query(
    collection(db, COLLECTION),
    where('article', '==', articleId)
  );

  const querySnapshot = await getDocs(q);
  const sentences: ISentence[] = [];
  querySnapshot.forEach((doc) => {
    const sentence = buildSentence(doc);
    sentences.push(sentence);
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
