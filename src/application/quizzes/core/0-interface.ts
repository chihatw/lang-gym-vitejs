export interface IQuiz {
  id: string;
  type: string;
  title: string;
  scoreIds: string[];
  createdAt: number;
  questionIds: string[];
  downloadURL: string;
  questionCount: number;
}
