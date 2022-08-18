import KANA_ROMAJI_MAP from 'kana-romaji-map';
import { nanoid } from 'nanoid';
import {
  doc,
  query,
  where,
  limit,
  getDoc,
  setDoc,
  orderBy,
  getDocs,
  deleteDoc,
  updateDoc,
  collection,
  DocumentData,
  writeBatch,
} from '@firebase/firestore';
import accentsForPitchesArray from 'accents-for-pitches-array';
import {
  Accents,
  AnsweredQuiz,
  INITIAL_QUESTION,
  INITIAL_SCORE_STATE,
  INITIAL_QUIZ_STATE,
  Question,
  QuestionSet,
  ScoreState,
  QuizListState,
  QuizState,
  Syllable,
  UnansweredQuiz,
  State,
} from '../Model';
import { db, storage } from '../repositories/firebase';
import { getDownloadURL, ref } from 'firebase/storage';
import { QuizFormState, QuizQuestion } from '../pages/Quiz/QuizPage/Model';

export const SPECIAL_MORAS = ['っ', 'ん', 'ー', 'ーん', 'ーっ'];

const SCORE_LIMIT = 50;
const QUIZ_LIMIT = 15;
const COLLECTIONS = {
  questions: 'questions',
  questionSets: 'questionSets',
  questionGroups: 'questionGroups',
  questionSetScores: 'questionSetScores',
};

export const getQuestionSet = async (
  questionSetId: string
): Promise<QuizState> => {
  console.log('get question set');
  let snapshot = await getDoc(doc(db, COLLECTIONS.questionSets, questionSetId));
  if (!snapshot.exists()) return INITIAL_QUIZ_STATE;
  const questionSet = buildQuestionSet(snapshot);
  const { id, uid, type, title, createdAt, questionCount, questionGroups } =
    questionSet;

  const questionGroupId = questionGroups[0];
  console.log('get question group');
  // questionIds を　questionGroups から取得
  snapshot = await getDoc(doc(db, COLLECTIONS.questionGroups, questionGroupId));
  if (!snapshot.exists()) return INITIAL_QUIZ_STATE;
  const questionIds: string[] = snapshot.data().questions;
  if (!questionIds || !questionIds.length) return INITIAL_QUIZ_STATE;

  let downloadURL = '';

  const questions: Question[] = [];
  await Promise.all(
    questionIds.map(async (questionId) => {
      console.log('get question');
      snapshot = await getDoc(doc(db, COLLECTIONS.questions, questionId));
      const question = snapshot.exists()
        ? buildQuestion(snapshot)
        : INITIAL_QUESTION;
      questions.push(question);
      if (snapshot.exists()) {
        const { question: _question } = snapshot.data();
        const {
          audio: { downloadURL: _downloadURL },
        }: {
          audio: { downloadURL: string; start: number; end: number };
        } = JSON.parse(_question);
        if (_downloadURL) {
          downloadURL = _downloadURL;
        }
      }
    })
  );

  let quizBlob: Blob | null = null;

  if (downloadURL) {
    const header = downloadURL.slice(0, 4);
    if (header !== 'http') {
      downloadURL = await getDownloadURL(ref(storage, downloadURL));
    }
    console.log('create quiz blob');
    const response = await fetch(downloadURL);
    quizBlob = await response.blob();
  }

  return {
    id,
    uid,
    type,
    title,
    quizBlob,
    questions,
    createdAt,
    initializing: false,
    questionCount,
  };
};

export const getQuestionSetScore = async (
  questionSetScoreId: string
): Promise<ScoreState> => {
  console.log('get question set score');
  const snapshot = await getDoc(
    doc(db, COLLECTIONS.questionSetScores, questionSetScoreId)
  );
  if (!snapshot.exists()) return INITIAL_SCORE_STATE;
  return buildQuestionSetScore(snapshot);
};

const buildQuestion = (doc: DocumentData): Question => {
  const { question } = doc.data();
  return {
    id: doc.id,
    question: question || '',
  };
};

export const getUnansweredQuizList = async (
  uid: string
): Promise<UnansweredQuiz[]> => {
  const list: UnansweredQuiz[] = [];
  const q = query(
    collection(db, COLLECTIONS.questionSets),
    where('answered', '==', false),
    where('uid', '==', uid),
    orderBy('createdAt', 'desc')
  );
  console.log('get questionSets');
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    list.push(buildUnansweredQuiz(doc));
  });
  return list;
};

export const getAnsweredQuizList = async (
  uid: string
): Promise<AnsweredQuiz[]> => {
  const questionSetScores: ScoreState[] = [];
  const questionSets: QuestionSet[] = [];

  // questionSetScores
  let q = query(
    collection(db, COLLECTIONS.questionSetScores),
    where('uid', '==', uid),
    orderBy('createdAt', 'desc'),
    limit(SCORE_LIMIT)
  );
  console.log('get questionSetScores');
  let querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    questionSetScores.push(buildQuestionSetScore(doc));
  });

  // questionSets
  q = query(
    collection(db, COLLECTIONS.questionSets),
    where('uid', '==', uid),
    where('answered', '==', true),
    orderBy('createdAt', 'desc'),
    limit(QUIZ_LIMIT)
  );
  console.log('get questionSets');
  querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => questionSets.push(buildQuestionSet(doc)));

  const list: AnsweredQuiz[] = questionSets.map((questionSet) => {
    const { title, id, createdAt, questionCount } = questionSet;
    const filteredScores = questionSetScores.filter(
      ({ questionSet }) => questionSet === id
    );
    const scores = filteredScores.map((score) => {
      const { id, score: _score, createdAt } = score;
      return {
        id,
        score: _score,
        createdAt,
        questionCount,
      };
    });
    return {
      id,
      title,
      createdAt,
      scores,
    };
  });

  return list;
};

const buildUnansweredQuiz = (doc: DocumentData): UnansweredQuiz => {
  const { title, createdAt } = doc.data();
  const quiz: UnansweredQuiz = {
    id: doc.id,
    title: title || '',
    createdAt: createdAt || 0,
  };
  return quiz;
};

export const buildQuestionSetScore = (doc: DocumentData): ScoreState => {
  const { uid, score, answers, createdAt, questionSet } = doc.data();
  const questionSetScore: ScoreState = {
    id: doc.id,
    uid: uid || '',
    score: score || 0,
    answers: answers || {},
    createdAt: createdAt || 0,
    questionSet: questionSet || '',
  };
  return questionSetScore;
};

const buildQuestionSet = (doc: DocumentData) => {
  const { uid, type, title, createdAt, questionCount, questionGroups } =
    doc.data();
  const questionSet: QuestionSet = {
    id: doc.id,
    uid: uid || '',
    type: type || 'articleRhythms',
    title: title || '',
    createdAt: createdAt || 0,
    questionCount: questionCount || 0,
    questionGroups: questionGroups || [],
  };
  return questionSet;
};

export const changePitchesArray = (
  pitchesArray: string[][][],
  wordIndex: number,
  moraIndex: number
): string[][][] => {
  let targetWord = pitchesArray[wordIndex];
  const target = targetWord[moraIndex];
  const next = targetWord[moraIndex + 1];
  const isAccent = !!next && next.length === 1 && target.length === 2;

  if (isAccent) {
    // アクセント核を削除
    targetWord = targetWord.map(([moraString], index) =>
      index === 0 ? [moraString] : [moraString, 'h']
    );
    pitchesArray.splice(wordIndex, 1, targetWord);
    return pitchesArray;
  }
  // アクセント核を付加

  // 頭高
  if (moraIndex === 0) {
    targetWord = targetWord.map(([moraString], index) =>
      index === moraIndex ? [moraString, 'h'] : [moraString]
    );
    pitchesArray.splice(wordIndex, 1, targetWord);
    return pitchesArray;
  }
  // 頭高以外
  targetWord = targetWord.map((mora, index) => {
    const string = mora[0];
    if (index === 0) {
      return [string];
    } else if (index <= moraIndex) {
      return [string, 'h'];
    }
    return [string];
  });

  pitchesArray.splice(wordIndex, 1, targetWord);
  return pitchesArray;
};

export const calcPitchesQuiz = (questions: QuizQuestion[]) => {
  let points = 0;

  questions.forEach((question) => {
    const { inputPitchesArray, correctPitchesArray, disableds } = question;
    inputPitchesArray.forEach((wordPitches, wordIndex) => {
      // アクセント固定は採点しない
      if (disableds.includes(wordIndex)) return;

      // 正解数を増やす
      const correctPitches = correctPitchesArray[wordIndex];
      if (JSON.stringify(wordPitches) === JSON.stringify(correctPitches)) {
        points++;
      }
    });
  });
  return points;
};

export const calcRhythmQuiz = (questions: QuizQuestion[]) => {
  let points = 0;
  questions.forEach((question) => {
    const { inputSpecialMoraArray, syllablesArray } = question;
    syllablesArray.forEach((wordMora, wordIndex) => {
      // wordMoraがすべて合っていれば、正解数を増やす
      let isCorrect = true;
      wordMora.forEach((syllable, syllableIndex) => {
        const { mora }: Syllable = syllable;
        const inputSpecialMora =
          inputSpecialMoraArray[wordIndex][syllableIndex];
        mora !== inputSpecialMora && (isCorrect = false);
      });
      isCorrect && points++;
    });
  });
  return points;
};

export const buildNewScore = (
  uid: string,
  point: number,
  inputs: { [questionId: string]: string },
  questionSetId: string
): ScoreState => {
  return {
    id: nanoid(8),
    uid,
    score: point,
    answers: inputs,
    createdAt: new Date().getTime(),
    questionSet: questionSetId,
  };
};

export const pitchesArray2Accents = (pitchesArray: string[][][]): Accents[] => {
  const accents: Accents[] = [];
  pitchesArray.forEach((wordPitch) => {
    const moras: string[] = wordPitch.map(([moraString]) => moraString);
    let pitchPoint = 0;
    wordPitch.forEach((mora, index) => {
      const next = wordPitch[index + 1];
      if (!!next && next.length === 1 && mora.length === 2) {
        // DON'T FORGET ADD 1 !!
        pitchPoint = index + 1;
      }
    });
    accents.push({ moras, pitchPoint });
  });
  return accents;
};

export const setNewScore = async (score: ScoreState) => {
  console.log('create question set score');
  type Keys = keyof ScoreState;
  for (const key of Object.keys(score)) {
    if (!Object.keys(INITIAL_SCORE_STATE).includes(key)) {
      console.log(`remove ${key}`);
      delete score[key as Keys];
    }
  }
  const { id, ...omitted } = score;
  try {
    await setDoc(doc(db, COLLECTIONS.questionSetScores, id), omitted);
    return true;
  } catch (e) {
    console.warn(e);
    return false;
  }
};

export const answeredQuestionSet = async (questionSetId: string) => {
  console.log('update question set');
  try {
    await updateDoc(doc(db, COLLECTIONS.questionSets, questionSetId), {
      answered: true,
    });
    return true;
  } catch (e) {
    console.warn(e);
    return false;
  }
};

export const updateQuizzes = (
  quiz: QuizState,
  score: ScoreState,
  quizList: QuizListState,
  questionCount: number
): QuizListState => {
  const { unansweredList, answeredList } = quizList;

  const updatedUnanswered = unansweredList.filter(({ id }) => id !== quiz.id);

  let updatedAnswered: AnsweredQuiz[] = answeredList;
  const answeredQuizIds = answeredList.map(({ id }) => id);

  const newScore = {
    id: score.id,
    score: score.score,
    createdAt: score.createdAt,
    questionCount,
  };

  if (answeredQuizIds.includes(quiz.id)) {
    // 既存アイテムの更新
    updatedAnswered = updatedAnswered.map((item) => {
      // 関係ないアイテムはそのまま
      if (item.id !== quiz.id) return item;

      // 該当アイテムは先頭にスコアを追加
      const updatedScores = [...item.scores];
      updatedScores.unshift(newScore);
      return { ...item, scores: updatedScores };
    });
  } else {
    // 新規アイテムの追加
    const newAnswered: AnsweredQuiz = {
      id: quiz.id,
      title: quiz.title,
      createdAt: quiz.createdAt,
      scores: [newScore],
    };
    updatedAnswered.unshift(newAnswered);
  }

  let updatedQuizzes: QuizListState = {
    unansweredList: updatedUnanswered,
    answeredList: updatedAnswered,
  };
  return updatedQuizzes;
};

export const getKanaSpecialMora = ({
  mora,
  fixedVowel,
  specialMora,
}: {
  mora: string;
  fixedVowel?: string;
  specialMora: string;
}) => {
  let kanaSpecialMora = '';
  // 「ー」の表記を母音に変更する
  switch (specialMora) {
    case 'っ':
    case 'ん':
      kanaSpecialMora = specialMora;
      break;
    case 'ー':
    case 'ーん':
    case 'ーっ':
      // 長音指定がある場合
      if (fixedVowel) {
        // 長音指定が「母音＋ん／っ」の場合があるので、長音指定の１文字目を抽出
        const longVowelFirstChar = fixedVowel.slice(0, 1);
        kanaSpecialMora = specialMora.replace('ー', longVowelFirstChar);
      }
      // 長音指定がない場合
      else {
        // 音節の特殊拍の直前の母音を「a,i,u,e,o」で返す
        const moraVowel = !!KANA_ROMAJI_MAP[mora]
          ? KANA_ROMAJI_MAP[mora].slice(-1)
          : '';
        let longVowel = 'ー';
        switch (moraVowel) {
          case 'a':
            longVowel = 'あ';
            break;
          case 'i':
          case 'e':
            longVowel = 'い';
            break;
          case 'u':
          case 'o':
            longVowel = 'う';
            break;
          default:
        }
        kanaSpecialMora = specialMora.replace('ー', longVowel);
      }
      break;
    default:
  }
  return kanaSpecialMora;
};

export const deleteQuestionSet = async (questionSetId: string) => {
  // questionSet の削除
  console.log('delete questionSet');
  await deleteDoc(doc(db, COLLECTIONS.questionSets, questionSetId));

  // questionSetScore の削除
  const batch = writeBatch(db);
  const q = query(
    collection(db, COLLECTIONS.questionSetScores),
    where('questionSet', '==', questionSetId)
  );
  console.log('get questionSetScores');
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();
};

export const buildQuizFormState = (
  state: State,
  quizId: string
): QuizFormState => {
  const { audioContext, quizzes } = state;
  const quiz = quizzes[quizId];
  const { title, createdAt, type, quizBlob, questionCount } = quiz;
  const questions: QuizQuestion[] = [];

  for (const question of quiz?.questions || []) {
    const { id, question: _question }: Question = question;

    const {
      japanese,
      disableds,
      accents,
      audio: { start, end },
      syllableUnits,
    }: {
      japanese: string;
      disableds: number[];
      accents: Accents[];
      audio: { downloadURL: string; start: number; end: number };
      syllableUnits: Syllable[][];
    } = JSON.parse(_question);

    const initialAccents = accents
      ? accents.map((accent, index) => ({
          ...accent,
          pitchPoint: disableds.includes(index) ? accent.pitchPoint : 0,
        }))
      : [];

    const correctPitchesArray = accentsForPitchesArray(accents || []);
    const inputPitchesArray = accentsForPitchesArray(initialAccents);
    const inputSpecialMoraArray: string[][] = [];
    const monitorSpecialMoraArray: string[][] = [];

    if (syllableUnits) {
      syllableUnits.forEach((wordSyllable) => {
        const monitorWordSpecialMora: string[] = [];
        const inputWordSpecialMora: string[] = [];
        const correctWordSpecialMora: string[] = [];
        wordSyllable.forEach((syllable) => {
          const { disabled, mora, longVowel } = syllable;
          correctWordSpecialMora.push(mora);
          if (!!disabled) {
            inputWordSpecialMora.push(disabled);
            const monitorString = getKanaSpecialMora({
              mora: syllable.syllable,
              fixedVowel: longVowel,
              specialMora: disabled,
            });
            monitorWordSpecialMora.push(monitorString);
          } else {
            inputWordSpecialMora.push('');
            monitorWordSpecialMora.push('');
          }
        });
        inputSpecialMoraArray.push(inputWordSpecialMora);
        monitorSpecialMoraArray.push(monitorWordSpecialMora);
      });
    }

    const quizQuestion: QuizQuestion = {
      id,
      end,
      start,
      japanese,
      disableds,
      syllablesArray: syllableUnits,
      inputPitchesArray,
      correctPitchesArray,
      inputSpecialMoraArray,
      monitorSpecialMoraArray,
    };
    questions.push(quizQuestion);
  }
  return {
    type: type || '',
    title: title || '',
    quizBlob: quizBlob || null,
    createdAt: createdAt || 0,
    questions,
    audioContext,
    questionCount: questionCount || 0,
  };
};
