export interface IQuizScore {
  id: string; // 旧scoreId
  score: number;
  createdAt: number;
  pitchAnswers: string[];
  rhythmAnswers: string[];
}
// 既存のscoreIdプロパティをidに統一
