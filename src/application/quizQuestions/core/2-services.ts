import { nanoid } from 'nanoid';
import { IQuizQuestion } from './0-interface';

export function addTempIdAndSortByIndex(questions: {
  [index: number]: Omit<IQuizQuestion, 'id' | 'index'>;
}) {
  let questionIds: string[] = [];
  const questionAddedIds: IQuizQuestion[] = [];
  for (let [index, question] of Object.entries(questions)) {
    const tempId = nanoid(8);
    questionAddedIds.push({
      ...question,
      id: tempId,
      index: Number(index),
    });
    questionIds[Number(index)] = tempId;
  }
  questionIds = questionIds.filter((i) => i);
  return { questionAddedIds, questionIds };
}
