export interface IQuizQuestion {
  quizQuestionId: string;
  index: number;
  japanese: string; // pitchQuiz で利用
  pitchStr: string; // pitchQuiz で利用
  disableds: number[]; // pitchQuiz, rhythmQuiz の非題化を wordIndex で指定
  end: number; // rhythmQuiz で利用
  start: number; // rhythmQuiz で利用
  syllables: { [index: number]: ISyllable[] }; // rhythmQuiz で利用
}

export interface ISyllable {
  kana: string;
  longVowel: string;
  specialMora: string;
}
