import KANA_ROMAJI_MAP from 'kana-romaji-map';

import {
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
  collection,
  DocumentData,
  orderBy,
  limit,
  setDoc,
} from '@firebase/firestore';

import { State, Quiz, Syllable, INITIAL_QUIZ } from '../Model';
import { db, storage } from '../repositories/firebase';

import { QuizFormState, QuizFormQuestion } from '../pages/Quiz/QuizPage/Model';
import string2PitchesArray from 'string2pitches-array';
import { getDownloadURL, ref } from 'firebase/storage';

export const SPECIAL_MORAS = ['っ', 'ん', 'ー', 'ーん', 'ーっ'];

const COLLECTIONS = {
  quizzes: 'quizzes',
};

export const getBlob = async (downloadURL: string) => {
  let blob = null;

  if (downloadURL) {
    const header = downloadURL.slice(0, 4);
    if (header !== 'http') {
      downloadURL = await getDownloadURL(ref(storage, downloadURL));
    }
    console.log('create blob');
    const response = await fetch(downloadURL);
    blob = await response.blob();
  }
  return blob;
};

export const getQuizzes = async (uid: string): Promise<Quiz[]> => {
  let quizzes: Quiz[] = [];
  let q = query(
    collection(db, COLLECTIONS.quizzes),
    where('uid', '==', uid),
    // 新しいものが前
    orderBy('createdAt', 'desc'),
    limit(10)
  );
  let querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    quizzes.push(buildQuiz(doc));
  });
  return quizzes;
};

export const setQuiz = async (quiz: Quiz) => {
  const { id, ...omitted } = quiz;
  await setDoc(doc(db, COLLECTIONS.quizzes, id), { ...omitted });
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
    const kana: string = mora[0];
    if (index === 0) {
      return [kana];
    } else if (index <= moraIndex) {
      return [kana, 'h'];
    }
    return [kana];
  });

  pitchesArray.splice(wordIndex, 1, targetWord);
  return pitchesArray;
};

export const calcPitchesQuiz = (questions: QuizFormQuestion[]) => {
  let points = 0;

  questions.forEach((question) => {
    question.inputPitchesArray.forEach((wordPitches, wordIndex) => {
      // アクセント固定は採点しない
      if (question.disableds.includes(wordIndex)) return;

      // 正解数を増やす
      const correctPitches = question.correctPitchesArray[wordIndex];
      if (JSON.stringify(wordPitches) === JSON.stringify(correctPitches)) {
        points++;
      }
    });
  });
  return points;
};

export const calcRhythmQuiz = (questions: QuizFormQuestion[]) => {
  let points = 0;
  questions.forEach((question) => {
    question.syllablesArray.forEach((wordMora, wordIndex) => {
      // 特殊拍固定は採点しない
      if (question.disableds.includes(wordIndex)) return;

      // wordMoraがすべて合っていれば、正解数を増やす
      let isCorrect = true;
      wordMora.forEach((syllable, syllableIndex) => {
        const inputSpecialMora =
          question.inputSpecialMoraArray[wordIndex][syllableIndex];
        syllable.specialMora !== inputSpecialMora && (isCorrect = false);
      });
      isCorrect && points++;
    });
  });
  return points;
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

export const deleteQuiz = async (id: string) => {
  console.log('delete quiz');
  await deleteDoc(doc(db, COLLECTIONS.quizzes, id));
};

export const buildQuizFormState = (
  state: State,
  quizId: string
): QuizFormState => {
  const { audioContext, quizzes } = state;
  const quiz = quizzes.find((item) => item.id === quizId) || INITIAL_QUIZ;
  const { title, createdAt, type, questionCount } = quiz;
  const questions: QuizFormQuestion[] = [];

  Object.values(quiz.questions).forEach((question, index) => {
    const correctPitchesArray = string2PitchesArray(question.pitchStr);
    const inputPitchesArray = correctPitchesArray.map(
      (wordPitch, wordIndex) => {
        const isDisabled = question.disableds.includes(wordIndex);
        if (isDisabled) {
          return wordPitch;
        } else {
          return wordPitch.map((mora, moraIndex) => {
            const kana = mora[0];
            return moraIndex === 0 ? [kana] : [kana, 'h'];
          });
        }
      }
    );

    const syllablesArray: Syllable[][] = [];
    const inputSpecialMoraArray: string[][] = [];
    const monitorSpecialMoraArray: string[][] = [];

    Object.values(question.syllables).forEach((wordSyllable, wordIndex) => {
      syllablesArray.push(wordSyllable);

      const monitorWordSpecialMora: string[] = [];
      const inputWordSpecialMora: string[] = [];
      const correctWordSpecialMora: string[] = [];

      const isDisabled = question.disableds.includes(wordIndex);

      wordSyllable.forEach((syllable) => {
        correctWordSpecialMora.push(syllable.specialMora);
        if (isDisabled) {
          inputWordSpecialMora.push(syllable.specialMora);
          const monitorString = getKanaSpecialMora({
            mora: syllable.kana,
            fixedVowel: syllable.longVowel,
            specialMora: syllable.specialMora,
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

    const quizQuestion: QuizFormQuestion = {
      id: String(index),
      end: question.end,
      start: question.start,
      japanese: question.japanese,
      disableds: question.disableds,
      syllablesArray,
      inputPitchesArray,
      correctPitchesArray,
      inputSpecialMoraArray,
      monitorSpecialMoraArray,
    };
    questions.push(quizQuestion);
  });

  return {
    type: type || '',
    title: title || '',
    quizBlob: state.blobs[quiz.downloadURL] || null,
    createdAt: createdAt || 0,
    questions,
    audioContext,
    questionCount: questionCount || 0,
  };
};

const buildQuiz = (doc: DocumentData): Quiz => {
  const {
    uid,
    type,
    title,
    scores,
    questions,
    createdAt,
    downloadURL,
    questionCount,
  } = doc.data();
  return {
    id: doc.id,
    uid: uid || '',
    type: type || '',
    title: title || '',
    scores: scores || {},
    questions: questions || {},
    createdAt: createdAt || 0,
    downloadURL: downloadURL || '',
    questionCount: questionCount || 0,
  };
};

export const rhythmAnswerToString = (rhythmAnswer: string[][]): string => {
  const wordSpecialMorasArray: string[] = [];
  for (const wordSpecialMoras of rhythmAnswer) {
    wordSpecialMorasArray.push(wordSpecialMoras.join(','));
  }
  return wordSpecialMorasArray.join('\n');
};
