import { useSelector } from 'react-redux';
import { RootState } from 'main';

import { buildTargetTimeStr } from 'application/randomWorkoutPage/core/2-services';
import { selectWorkout } from 'application/randomWorkoutPage/framework/2-selector';

const Header = () => {
  const workout = useSelector((state: RootState) => selectWorkout(state));

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
          <span style={{ fontSize: 20 }}>{buildTargetTimeStr(workout)}</span>
        </div>
      </div>
    </>
  );
};

export default Header;
