import { IRandomWorkout } from 'application/randomWorkouts/core/0-interface';

export function buildTargetTimeStr(workout: IRandomWorkout) {
  const readTime = workout.cueIds.length * 0.5;
  const targetTimeTenTimes =
    Math.round(
      ((workout.beatCount * workout.roundCount) / (workout.targetBpm / 60)) * 10
    ) +
    readTime * 10;
  const targetTimeSecond = Math.floor(targetTimeTenTimes / 10);
  const targetTimePoints = targetTimeTenTimes % 10;
  return `${targetTimeSecond}.${targetTimePoints}`;
}

export function buildTimeNumber(miliSeconds: number) {
  const seconds = String(Math.floor(miliSeconds / 1000));
  const underDecimalPoint = String(Math.floor((miliSeconds % 1000) / 100));
  return { seconds, underDecimalPoint };
}
