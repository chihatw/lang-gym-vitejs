import * as R from 'ramda';
import { Card, CardContent, useTheme } from '@mui/material';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../../App';
import { INITIAL_RANDOM_WORKOUT, RandomWorkout } from '../../../Model';

const WorkoutRow = ({ index }: { index: number }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { state } = useContext(AppContext);
  const workouts = R.pathOr<{ [key: string]: RandomWorkout }>({}, [
    'workout',
    'workouts',
  ])(state);
  const workout = Object.values(workouts)[index] || INITIAL_RANDOM_WORKOUT;
  const { title, id: workoutId } = workout;
  const openWorkoutPage = () => {
    navigate(`/workout/${workoutId}`);
  };
  return (
    <Card
      sx={{
        cursor: 'pointer',
        WebkitTapHighlightColor: '#EAF4F5',
        '&:active,&:focus': { background: '#EAF4F5' },
      }}
      onClick={openWorkoutPage}
      elevation={0}
    >
      <CardContent>
        <div
          style={{
            ...(theme.typography as any).mPlusRounded300,
            userSelect: 'none',
          }}
        >
          <div style={{ fontSize: 14 }}>{title}</div>
          {/* debug blobがあれば、目標BPM 録音BPM スライダー を表示 */}
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkoutRow;
