import { css } from '@emotion/css';
import PlayCircleRounded from '@mui/icons-material/PlayCircleRounded';
import { Button, IconButton } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { createSourceNode } from '../../../../services/utils';
import { buildCueIds } from '../../../../services/workingMemory';
import {
  INITIAL_WORKING_MEMORY_FORM_ANSWER_LOG,
  WorkingMemoryFormAnswerLog,
  WorkingMemoryFormState,
} from '../Model';
import WorkingMemoryFormFooter from './common/WorkingMemoryFormFooter';

const WorkingMemoryFormPlayButton = ({
  state,
  dispatch,
}: {
  state: WorkingMemoryFormState;
  dispatch: React.Dispatch<WorkingMemoryFormState>;
}) => {
  const [initialize, setInitialize] = useState(true);
  const AnimationElemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialize) {
      const AnswerList = AnimationElemRef.current;
      if (!AnswerList) return;
      AnswerList.classList.add('initial');
      setInitialize(false);
      setTimeout(() => {
        AnswerList.classList.remove('initial');
      }, 0);
    }
  }, [initialize]);

  const currentCueId = state.cueIds[state.currentIndex];
  const currentCue = state.cues[currentCueId];
  const play = async () => {
    if (!state.blob || !state.audioContext) return;
    const sourceNode = await createSourceNode(state.blob, state.audioContext);
    sourceNode.start(0, currentCue.start, currentCue.end - currentCue.start);
  };

  const handleClick = () => {
    const nextIndext = state.currentIndex + 1;
    const nextAnswerIndex = nextIndext - state.offset;
    const firstAnswer: WorkingMemoryFormAnswerLog =
      INITIAL_WORKING_MEMORY_FORM_ANSWER_LOG;

    if (nextAnswerIndex === 0) {
      firstAnswer.startAt = Math.round(performance.now());
    }
    const updatedState: WorkingMemoryFormState = {
      ...state,
      currentIndex: nextIndext,
      answers: [firstAnswer],
    };
    setInitialize(true);
    dispatch(updatedState);
  };

  return (
    <div>
      <div
        style={{
          paddingTop: 40,
          paddingBottom: 120,
          display: 'flex',
          justifyContent: 'center',
          color: '#555',
        }}
      >
        <div>
          <span>請</span>
          <span style={{ fontWeight: 'bold', margin: '0 2px' }}>記住</span>
          <span>播放的語音</span>
        </div>
      </div>
      <div
        ref={AnimationElemRef}
        className={css({
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 1,
          transition: 'all 0.3s ease-in-out',
          transform: 'translateY(0%)',
          '&.initial': {
            opacity: 0,
            transition: '0s',
            transform: 'translateY(50%)',
          },
        })}
      >
        {!!state.audioContext && !!state.blob ? (
          <IconButton color='primary' onClick={play}>
            <PlayCircleRounded sx={{ fontSize: 120 }} />
          </IconButton>
        ) : (
          <div
            style={{
              fontWeight: 900,
              fontFamily: 'Roboto, sans-serif',
              fontSize: 48,
              color: 'rgba(0,0,0,0.15)',
            }}
          >
            touch me
          </div>
        )}
      </div>
      <div
        style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}
      >
        <Button
          sx={{ color: 'white', width: 240 }}
          variant='contained'
          onClick={handleClick}
        >
          記住了
        </Button>
      </div>
      <WorkingMemoryFormFooter state={state} dispatch={dispatch} />
    </div>
  );
};

export default WorkingMemoryFormPlayButton;
