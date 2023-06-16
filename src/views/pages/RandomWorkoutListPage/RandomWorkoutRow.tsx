import Delete from '@mui/icons-material/Delete';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, IconButton, useTheme } from '@mui/material';

import { RootState } from 'main';

import AudioBufferSlider from 'views/components/AudioBufferSlider';
import { randomWorkoutsActions } from 'application/randomWorkouts/framework/0-reducer';

const RandomWorkoutRow = ({ workoutId }: { workoutId: string }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const randomWorkouts = useSelector(
    (state: RootState) => state.randomWorkouts
  );
  const { fetchedAudioBuffers } = useSelector(
    (state: RootState) => state.audio
  );

  const randomWorkout = useMemo(
    () => randomWorkouts[workoutId],
    [workoutId, randomWorkouts]
  );

  const audioBuffer = useMemo(
    () =>
      randomWorkout && randomWorkout.storagePath
        ? fetchedAudioBuffers[randomWorkout.storagePath]
        : null,
    [randomWorkout, fetchedAudioBuffers]
  );

  const openWorkoutPage = () => {
    navigate(`/workout/${workoutId}`);
  };
  const handleDelete = async () => {
    dispatch(randomWorkoutsActions.clearStoragePath(workoutId));
  };

  if (!randomWorkout) return <></>;
  return (
    <div style={{ display: 'grid', rowGap: 16 }}>
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
              display: 'grid',
              rowGap: 8,
              marginBottom: -16,
            }}
          >
            <div style={{ fontSize: 14 }}>{randomWorkout.title}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
              <div>
                <span style={{ fontSize: 12 }}>目標BPM:</span>
                <span style={{ fontSize: 20, paddingLeft: 20 }}>
                  {randomWorkout.targetBpm}
                </span>
              </div>
              <div>
                <span style={{ fontSize: 12 }}>到達BPM:</span>
                <span style={{ fontSize: 20, paddingLeft: 20 }}>
                  {!!audioBuffer ? randomWorkout.resultBpm : '--'}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {!!audioBuffer && (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ flexGrow: 1 }}>
            <AudioBufferSlider
              audioBuffer={audioBuffer}
              start={0}
              end={audioBuffer.duration}
            />
          </div>
          <IconButton size='small' onClick={handleDelete}>
            <Delete />
          </IconButton>
        </div>
      )}
    </div>
  );
};

export default RandomWorkoutRow;
