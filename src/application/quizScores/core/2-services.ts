import { nanoid } from 'nanoid';
import { IQuizScore } from './0-interface';

export function addTempIdAndSortByCreatedAt(scores: {
  [createdAt: number]: Omit<IQuizScore, 'id'>;
}) {
  const scoreAddedIds: IQuizScore[] = [];
  for (let item of Object.values(scores)) {
    const tempId = nanoid(8);
    scoreAddedIds.push({ ...item, id: tempId });
  }

  const scoreIds: string[] = scoreAddedIds
    .sort((a, b) => b.createdAt - a.createdAt)
    .map((score) => score.id);

  return { scoreAddedIds, scoreIds };
}
