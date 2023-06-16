import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'main';

import { buildTargetTimeStr } from 'application/randomWorkoutPage/core/2-services';

const Header = () => {
  const { workoutId } = useSelector(
    (state: RootState) => state.randomWorkoutPage
  );
  const randomWorkouts = useSelector(
    (state: RootState) => state.randomWorkouts
  );

  const workout = useMemo(
    () => randomWorkouts[workoutId],
    [workoutId, randomWorkouts]
  );
  const targetTimeStr = useMemo(
    () => (workout ? buildTargetTimeStr(workout) : ''),
    [workout]
  );

  if (!workout) return <></>;

  return (
    <>
      <div
        style={{ fontSize: 24 }}
      >{`${workout.title} - ${workout.roundCount}周`}</div>
      <div style={{ height: 8 }} />
      <div>
        <div>
          <span style={{ fontSize: 14 }}>目標BPM: </span>
          <span style={{ fontSize: 20 }}>{workout.targetBpm}</span>
        </div>
        <div>
          <span style={{ fontSize: 14 }}>目標時間: </span>
          <span style={{ fontSize: 20 }}>{targetTimeStr}</span>
        </div>
      </div>
    </>
  );
};

export default Header;
