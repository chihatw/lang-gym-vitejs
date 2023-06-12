import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../infrastructure/firebase';

const COLLECTIONS = {
  articles: 'articles',
  sentences: 'sentences',
  assignments: 'assignments',
  sentenceParseNews: 'sentenceParseNews',
  articleSentenceForms: 'articleSentenceForms',
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
