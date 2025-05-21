import { shuffle } from 'application/utils/utils';
import { IRandomWorkoutCue } from './0-interface';

export const buildCueIds = (cues: IRandomWorkoutCue[], roundCount: number) => {
  let newCueIds: string[] = [];
  const cueIds = cues.map(({ id }) => id);
  for (let i = 0; i < roundCount; i++) {
    newCueIds = newCueIds.concat(shuffle(cueIds));
  }
  return newCueIds;
};

export const calcBpm = (
  miliSeconds: number,
  beatCount: number,
  roundCount: number,
  cueCount: number
) => {
  if (!miliSeconds) return 0;
  const totalBeatCount = roundCount * beatCount;
  const seconds =
    Math.floor(miliSeconds / 1000) +
    Math.floor((miliSeconds % 1000) / 100) / 10;

  const readTime = cueCount * 0.5; // 1問を 0.5秒で把握する

  const bps = totalBeatCount / Math.max(seconds - readTime, 0.1);

  const bpm = Math.round(bps * 60);
  return bpm;
};

export const miliSecondsToSeconds = (miliSeconds: number) => {
  const seconds =
    Math.floor(miliSeconds / 1000) +
    Math.floor((miliSeconds % 1000) / 100) / 10;
  return seconds;
};
