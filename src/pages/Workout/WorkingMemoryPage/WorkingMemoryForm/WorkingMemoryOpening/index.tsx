import * as R from 'ramda';
import { Button, useTheme } from '@mui/material';
import React, { useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../../../../../App';
import { WorkingMemoryFormState } from '../../Model';
import { getTodaysLogCount } from '../../../../../services/workingMemory';
import { WORKING_MEMORY_MAX_ROUND } from '../../../../../assets/constants';

const WorkingMemoryOpening = ({
  state,
  dispatch,
}: {
  state: WorkingMemoryFormState;
  dispatch: React.Dispatch<WorkingMemoryFormState>;
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { workoutId } = useParams();
  const { state: appState } = useContext(AppContext);
  if (!workoutId) return <></>;

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();

  const workingMemory = appState.workingMemories[workoutId];
  const todaysLogCount = !!workingMemory ? getTodaysLogCount(workingMemory) : 0;

  const handleStart = () => {
    const updatedState = R.compose(
      R.assocPath<string, WorkingMemoryFormState>(['scene'], 'playbutton'),
      R.assocPath<number, WorkingMemoryFormState>(
        ['log', 'practice', 0, 'createdAt'],
        Date.now()
      )
    )(state);
    dispatch(updatedState);
  };

  const handleBack = () => {
    navigate('/workout/list');
  };

  return (
    <div style={{ display: 'grid', paddingTop: 64, rowGap: 80 }}>
      <div
        style={{
          ...(theme.typography as any).lato900,
          textAlign: 'center',
          color: '#aaa',
        }}
      >
        <span style={{ fontSize: 72 }}>{year}</span>
        <span>年</span>
        <span style={{ fontSize: 72 }}>{month}</span>
        <span>月</span>
        <span style={{ fontSize: 72 }}>{day}</span>
        <span>日</span>
      </div>
      {(() => {
        if (todaysLogCount > WORKING_MEMORY_MAX_ROUND - 1) {
          return (
            <div style={{ display: 'grid', rowGap: 120 }}>
              <div
                style={{
                  ...(theme.typography as any).mPlusRounded300,
                  textAlign: 'center',
                  color: '#777',
                  paddingTop: 40,
                  fontSize: 24,
                  lineHeight: 2,
                }}
              >
                <div>今日の練習は3回終了しました。</div>
                <div>また、明日お待ちしています。</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <Button
                  variant='outlined'
                  sx={{ width: 240 }}
                  onClick={handleBack}
                >
                  戻る
                </Button>
              </div>
            </div>
          );
        }
        return (
          <div style={{ textAlign: 'center', display: 'grid', rowGap: 64 }}>
            <div
              style={{
                ...(theme.typography as any).lato900,

                color: '#aaa',
              }}
            >
              <span style={{ fontSize: 180 }}>{todaysLogCount + 1}</span>
              <span>回目</span>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Button
                variant='contained'
                sx={{ width: 240, color: 'white' }}
                onClick={handleStart}
              >
                開始
              </Button>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default WorkingMemoryOpening;
