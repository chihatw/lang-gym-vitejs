import { nanoid } from 'nanoid';
import { IQuizScore } from './0-interface';

export function addTempIdAndSortByCreatedAt(scores: {
  [createdAt: number]: IQuizScore;
}) {
  const scoreAddedIds: { [id: string]: IQuizScore } = {};
  for (let item of Object.values(scores)) {
    const tempId = nanoid(8);
    scoreAddedIds[tempId] = item;
  }

  const scoreIds: string[] = Object.entries(scoreAddedIds)
    .sort((a, b) => b[1].createdAt - a[1].createdAt)
    .map(([key, value]) => key);

  return { scoreAddedIds, scoreIds };
}
