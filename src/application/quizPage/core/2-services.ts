import {
  IQuizQuestion,
  ISyllable,
} from 'application/quizQuestions/core/0-interface';

import { IQuizScore } from 'application/quizScores/core/0-interface';
import { IQuiz } from 'application/quizzes/core/0-interface';
import { KANA_ROMAJI_MAP } from 'application/utils/kanaRomajiMap/kanaRomajiMap';
import { pitchesArray2String } from 'application/utils/pitchesArray2String';
import { string2PitchesArray } from 'application/utils/string2PitchesArray';
import { QUIZ_TIPE } from './1-constants';

export const buildInputPitchStr = (pitchStr: string, disableds: number[]) => {
  return pitchStr
    .split(' ')
    .map((wordPitchStr, wordIndex) => {
      const isDisabled = disableds.includes(wordIndex);
      return isDisabled ? wordPitchStr : wordPitchStr.replace('＼', '');
    })
    .join(' ');
};

export const buildRhythmQuizProps = (
  syllables: {
    [index: number]: ISyllable[];
  },
  disableds: number[]
) => {
  const syllablesArray: ISyllable[][] = [];
  const inputSpecialMoraArray: string[][] = [];
  const monitorSpecialMoraArray: string[][] = [];

  Object.values(syllables).forEach((wordSyllable, wordIndex) => {
    syllablesArray.push(wordSyllable);

    const monitorWordSpecialMora: string[] = [];
    const inputWordSpecialMora: string[] = [];
    const correctWordSpecialMora: string[] = [];

    const isDisabled = disableds.includes(wordIndex);

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

  return { syllablesArray, inputSpecialMoraArray, monitorSpecialMoraArray };
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

export const changePitchesArray = (
  inputPitchStr: string,
  wordIndex: number,
  moraIndex: number
): string => {
  const inputPitchesArray = string2PitchesArray(inputPitchStr);
  let targetWord = inputPitchesArray[wordIndex];
  const target = targetWord[moraIndex];
  const next = targetWord[moraIndex + 1];
  const isAccent = !!next && next.length === 1 && target.length === 2;

  if (isAccent) {
    // アクセント核を削除
    targetWord = targetWord.map(([moraString], index) =>
      index === 0 ? [moraString] : [moraString, 'h']
    );
    inputPitchesArray.splice(wordIndex, 1, targetWord);
    return pitchesArray2String(inputPitchesArray);
  }
  // アクセント核を付加

  // 頭高
  if (moraIndex === 0) {
    targetWord = targetWord.map(([moraString], index) =>
      index === moraIndex ? [moraString, 'h'] : [moraString]
    );
    inputPitchesArray.splice(wordIndex, 1, targetWord);
    return pitchesArray2String(inputPitchesArray);
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

  inputPitchesArray.splice(wordIndex, 1, targetWord);
  return pitchesArray2String(inputPitchesArray);
};

export const calcPoints = (
  quiz: IQuiz,
  quizQuestions: {
    [id: string]: IQuizQuestion | undefined;
  },
  inputPitchStrs: {
    [questionId: string]: string;
  },
  inputSpecialMoraArrays: {
    [questionId: string]: string[][];
  }
) => {
  let points = 0;
  switch (quiz.type) {
    case QUIZ_TIPE.articleAccents: {
      points = calcPitchesQuiz(quiz.questionIds, quizQuestions, inputPitchStrs);
      break;
    }
    case QUIZ_TIPE.articleRhythms: {
      points = calcRhythmQuiz(
        quiz.questionIds,
        quizQuestions,
        inputSpecialMoraArrays
      );
      break;
    }
    default:
  }
  return points;
};

const calcPitchesQuiz = (
  questionIds: string[],
  questions: { [questionId: string]: IQuizQuestion | undefined },
  inputPitchStrs: { [questionId: string]: string }
) => {
  let points = 0;

  for (const questionId of questionIds) {
    const question = questions[questionId];
    if (!question) continue;
    const inputPitchStr = inputPitchStrs[questionId];
    inputPitchStr.split(' ').forEach((inputWordPitchStr, wordIndex) => {
      // アクセント固定は採点しない
      if (question.disableds.includes(wordIndex)) return;

      // 正解数を増やす
      const correctWordPitchStr = question.pitchStr.split(' ')[wordIndex];
      if (inputWordPitchStr === correctWordPitchStr) {
        points++;
      }
    });
  }
  return points;
};

const calcRhythmQuiz = (
  questionIds: string[],
  questions: { [questionId: string]: IQuizQuestion | undefined },
  inputSpecialMoraArrays: { [questionIds: string]: string[][] }
) => {
  let points = 0;

  for (const questionId of questionIds) {
    const question = questions[questionId];
    if (!question) continue;
    const inputSpecialMoraArray = inputSpecialMoraArrays[questionId];

    Object.values(question.syllables).forEach((wordMora, wordIndex) => {
      // 特殊拍固定は採点しない
      if (question.disableds.includes(wordIndex)) return;

      // wordMoraがすべて合っていれば、正解数を増やす
      let isCorrect = true;
      wordMora.forEach((syllable, syllableIndex) => {
        const inputSpecialMora =
          inputSpecialMoraArray[wordIndex][syllableIndex];
        syllable.specialMora !== inputSpecialMora && (isCorrect = false);
      });
      isCorrect && points++;
    });
  }
  return points;
};

export const buildQuestionAnswers = (
  quiz: IQuiz,
  inputPitchStrs: { [questionId: string]: string },
  inputSpecialMoraArrays: {
    [questionId: string]: string[][];
  }
) => {
  const pitchAnswers: string[] = [];
  const rhythmAnswers: string[] = [];

  for (const questionIds of quiz.questionIds) {
    switch (quiz.type) {
      case QUIZ_TIPE.articleAccents: {
        const inputPitchStr = inputPitchStrs[questionIds];
        pitchAnswers.push(inputPitchStr);
        break;
      }
      case QUIZ_TIPE.articleRhythms: {
        const inputSpecialMoraArray = inputSpecialMoraArrays[questionIds];
        const rhythmAnswerStr = rhythmAnswerToString(inputSpecialMoraArray);
        rhythmAnswers.push(rhythmAnswerStr);
        break;
      }
      default:
    }
  }

  return { pitchAnswers, rhythmAnswers };
};

const rhythmAnswerToString = (rhythmAnswer: string[][]): string => {
  const wordSpecialMorasArray: string[] = [];
  for (const wordSpecialMoras of rhythmAnswer) {
    wordSpecialMorasArray.push(wordSpecialMoras.join(','));
  }
  return wordSpecialMorasArray.join('\n');
};

export const buildRemoteScores = (scores: (IQuizScore | undefined)[]) => {
  const remoteScores: { [createdAt: number]: IQuizScore } = {};

  for (const score of scores) {
    if (!score) continue;
    remoteScores[score.createdAt] = score;
  }

  return remoteScores;
};
