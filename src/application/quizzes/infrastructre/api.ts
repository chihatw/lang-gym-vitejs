import {
  doc,
  query,
  where,
  getDocs,
  collection,
  DocumentData,
  orderBy,
  limit,
  getDoc,
  updateDoc,
} from '@firebase/firestore';
import { db } from 'infrastructure/firebase';
import { IQuiz } from '../core/0-interface';
import { IQuizScore } from 'application/quizScores/core/0-interface';
import { addTempIdAndSortByCreatedAt } from 'application/quizScores/core/2-services';
import { IQuizQuestion } from 'application/quizQuestions/core/0-interface';
import { addTempIdAndSortByIndex } from 'application/quizQuestions/core/2-services';

const COLLECTION = 'quizzes';

export const fetchQuiz = async (
  quizId: string
): Promise<{
  quiz: IQuiz | null;
  quizScores: IQuizScore[];
  quizQuestions: IQuizQuestion[];
}> => {
  console.log(`%cfetch ${COLLECTION}`, 'color:red');

  const docSnapshot = await getDoc(doc(db, COLLECTION, quizId));

  if (!docSnapshot.exists()) {
    return { quiz: null, quizScores: [], quizQuestions: [] };
  }

  const { quiz, quizScores, quizQuestions } = buildQuiz(docSnapshot);

  return { quiz, quizScores, quizQuestions };
};

export const fetchQuizzes = async (uid: string) => {
  console.log(`%cfetch ${COLLECTION}`, 'color:red');
  const q = query(
    collection(db, COLLECTION),
    where('uid', '==', uid),
    // 新しいものが前
    orderBy('createdAt', 'desc'),
    limit(10)
  );

  const querySnapshot = await getDocs(q);

  const quizzes: IQuiz[] = [];
  let quizScores: IQuizScore[] = [];
  let quizQuestions: IQuizQuestion[] = [];

  querySnapshot.forEach((doc) => {
    const {
      quiz,
      quizScores: _quizScores,
      quizQuestions: _quizQuestions,
    } = buildQuiz(doc);
    quizzes.push(quiz);
    quizScores = [...quizScores, ..._quizScores];
    quizQuestions = [...quizQuestions, ..._quizQuestions];
  });

  return { quizzes, quizScores, quizQuestions };
};

export const updateQuizScore = async (
  quizId: string,
  scores: { [createdAt: number]: IQuizScore }
) => {
  await updateDoc(doc(db, COLLECTION, quizId), { scores });
};

const buildQuiz = (
  doc: DocumentData
): {
  quiz: IQuiz;
  quizScores: IQuizScore[];
  quizQuestions: IQuizQuestion[];
} => {
  const {
    type,
    title,
    scores,
    questions,
    createdAt,
    downloadURL,
    questionCount,
  } = doc.data();

  const { scoreAddedIds, scoreIds } = addTempIdAndSortByCreatedAt(scores);

  const { questionAddedIds, questionIds } = addTempIdAndSortByIndex(questions);

  const quiz = {
    id: doc.id,
    type: type || '',
    title: title || '',
    createdAt: createdAt || 0,
    downloadURL: downloadURL || '',
    questionCount: questionCount || 0,
    scoreIds,
    questionIds,
  };
  return {
    quiz,
    quizScores: scoreAddedIds,
    quizQuestions: questionAddedIds,
  };
};
