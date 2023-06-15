import { Button, Container, Divider, Modal, useTheme } from '@mui/material';
import React from 'react';

import { INITIAL_CUE, RandomWorkout } from '../../../Model';
import TimeDisplay from './TimeDisplay';
import BlobSlider from '../../components/BlobSlider';
import { WorkoutFormState } from './Model';
import SentencePitchLine from '../../components/SentencePitchLine';

const CheckPane = React.memo(
  ({
    blob,
    workout,
    formState,
    miliSeconds,
    saveRecordedBlob,
    abandonRecordedBlob,
  }: {
    blob: Blob;
    workout: RandomWorkout;
    formState: WorkoutFormState;
    miliSeconds: number;
    saveRecordedBlob: () => void;
    abandonRecordedBlob: () => void;
  }) => {
    const theme = useTheme();

    return (
      <Modal open={formState.isChecking}>
        <div
          style={{
            width: '100vw',
            minHeight: '100vh',
            background: '#fafafa',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Container maxWidth='sm'>
            <div style={{ display: 'grid', rowGap: 16 }}>
              <TimeDisplay miliSeconds={miliSeconds} />
              <div
                style={{
                  ...(theme.typography as any).mRounded300,
                  fontSize: 48,
                  marginTop: -32,
                  marginBottom: -16,
                  textAlign: 'center',
                }}
              >
                <span style={{ fontSize: 16 }}>BPM: </span>
                <span>{workout.resultBpm}</span>
              </div>
              <div
                style={{
                  color: '#52a2aa',
                  textAlign: 'center',
                  padding: '8px 0',
                  userSelect: 'none',
                }}
              >
                録音をチェックしてください
              </div>
              <BlobSlider
                blob={blob}
                spacer={5}
                duration={miliSeconds / 1000 + 0.3}
              />
              <div
                style={{
                  display: 'grid',
                  rowGap: 8,
                  height: 320,
                  overflowY: 'scroll',
                  background: 'white',
                  borderRadius: 8,
                }}
              >
                <div style={{ padding: '24px 0' }}>
                  {workout.cueIds.map((cueId, index) => {
                    const cue =
                      workout.cues.find((item) => item.id === cueId) ||
                      INITIAL_CUE;
                    const { pitchStr } = cue;
                    return (
                      <div key={index}>
                        <div
                          style={{ display: 'flex', justifyContent: 'center' }}
                        >
                          <SentencePitchLine pitchStr={pitchStr} />
                        </div>
                        <Divider />
                      </div>
                    );
                  })}
                </div>
                <div style={{ display: 'grid', rowGap: 16 }}>
                  <Button
                    onClick={saveRecordedBlob}
                    variant='contained'
                    color='primary'
                    sx={{ color: 'white' }}
                  >
                    きれいに読めました
                  </Button>
                  <Button
                    onClick={abandonRecordedBlob}
                    variant='outlined'
                    color='primary'
                  >
                    もう一度録音します
                  </Button>
                </div>
                <div style={{ height: 180 }} />
              </div>
            </div>
          </Container>
        </div>
      </Modal>
    );
  }
);

export default CheckPane;
