import { nanoid } from 'nanoid';
import { IQuizQuestion } from './0-interface';

export function addTempIdAndSortByIndex(questions: {
  [index: number]: IQuizQuestion;
}) {
  let questionIds: string[] = [];
  const questionAddedIds: { [id: string]: IQuizQuestion } = {};
  for (let [index, question] of Object.entries(questions)) {
    const tempId = nanoid(8);
    questionAddedIds[tempId] = question;
    const _index = Number(index);
    questionIds[_index] = tempId;
  }
  questionIds = questionIds.filter((i) => i);
  return { questionAddedIds, questionIds };
}
