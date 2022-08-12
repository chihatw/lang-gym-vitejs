import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../../../App';

const Header = () => {
  const { workoutId } = useParams();
  const { state } = useContext(AppContext);
  const { workout: stateWorkout } = state;

  const { workouts } = stateWorkout;

  if (!workoutId) return <></>;
  const workout = workouts[workoutId];
  const { title, targetBpm, beatCount, roundCount } = workout;

  const targetTimeTenTimes =
    Math.round(((beatCount * roundCount) / (targetBpm / 60)) * 10) * 2;
  const targetTimeSecond = Math.floor(targetTimeTenTimes / 10);
  const targetTimePoints = targetTimeTenTimes % 10;
  return (
    <>
      <div style={{ fontSize: 24 }}>{title}</div>
      <div style={{ height: 8 }} />
      <div>
        <div>
          <span style={{ fontSize: 14 }}>目標BPM: </span>
          <span style={{ fontSize: 20 }}>{targetBpm}</span>
        </div>
        <div>
          <span style={{ fontSize: 14 }}>目標時間: </span>
          <span
            style={{ fontSize: 20 }}
          >{`${targetTimeSecond}.${targetTimePoints}`}</span>
        </div>
      </div>
    </>
  );
};

export default Header;
