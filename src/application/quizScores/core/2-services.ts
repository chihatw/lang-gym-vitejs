import { nanoid } from 'nanoid';
import { IQuizScore } from './0-interface';

export function addTempIdAndSortByCreatedAt(scores: {
  [createdAt: number]: Omit<IQuizScore, 'scoreId'>;
}) {
  const scoreAddedIds: IQuizScore[] = [];
  for (let item of Object.values(scores)) {
    const tempId = nanoid(8);
    scoreAddedIds.push({ ...item, scoreId: tempId });
  }

  const scoreIds: string[] = scoreAddedIds
    .sort((a, b) => b.createdAt - a.createdAt)
    .map((score) => score.scoreId);

  return { scoreAddedIds, scoreIds };
}
