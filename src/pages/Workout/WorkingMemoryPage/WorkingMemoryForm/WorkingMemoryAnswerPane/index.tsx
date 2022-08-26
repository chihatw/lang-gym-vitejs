import * as R from 'ramda';
import { css } from '@emotion/css';
import { Button } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { createSourceNode } from '../../../../../services/utils';
import {
  INITIAL_WORKING_MEMORY_FORM_ANSWER_LOG,
  WorkingMemoryFormAnswerLog,
  WorkingMemoryFormState,
} from '../../Model';
import WorkingMemoryAnswerCard from './WorkingMemoryAnswerCard';
import WorkingMemoryAnswerPaneMessage from './WorkingMemoryAnswerPaneMessage';
import WorkingMemoryFormFooter from '../common/WorkingMemoryFormFooter';

const WorkingMemoryAnswerPane = ({
  state,
  dispatch,
  handleSubmit,
}: {
  state: WorkingMemoryFormState;
  dispatch: React.Dispatch<WorkingMemoryFormState>;
  handleSubmit: (state: WorkingMemoryFormState) => void;
}) => {
  const currentCueId = state.cueIds[state.currentIndex];
  const currentCue = state.cues[currentCueId];

  const [selectedId, setSelectedId] = useState('');
  const [initialize, setInitialize] = useState(true);

  const AnswerListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialize) {
      const AnswerList = AnswerListRef.current;
      if (!AnswerList) return;
      AnswerList.classList.add('initial');
      setInitialize(false);
      setTimeout(() => {
        AnswerList.classList.remove('initial');
      }, 0);
    }
  }, [initialize]);

  const handleTap = (cueId: string) => {
    const answerIndex = state.currentIndex - state.offset;
    const updatedTapped = [...state.answers[answerIndex].tapped];
    updatedTapped.push(cueId);

    const updatedState = R.assocPath<string[], WorkingMemoryFormState>(
      ['answers', answerIndex, 'tapped'],
      updatedTapped
    )(state);
    dispatch(updatedState);
    let _selectedId = '';
    if (selectedId !== cueId) {
      _selectedId = cueId;
    }
    setSelectedId(_selectedId);
    currentCue && play();
  };

  const play = async () => {
    if (!state.blob || !state.audioContext) return;
    const sourceNode = await createSourceNode(state.blob, state.audioContext);
    sourceNode.start(0, currentCue.start, currentCue.end - currentCue.start);
  };

  const handleNext = () => {
    const answerIndex = state.currentIndex - state.offset;
    const currentTime = Math.round(performance.now());
    let updatedState = R.compose(
      R.assocPath<number, WorkingMemoryFormState>(
        ['currentIndex'],
        state.currentIndex + 1
      ),
      R.assocPath<number, WorkingMemoryFormState>(
        ['answers', answerIndex, 'endAt'],
        currentTime
      )
    )(state);
    if (answerIndex + 1 === state.cueCount) {
      updatedState = R.assocPath<number, WorkingMemoryFormState>(
        ['answers', answerIndex, 'endAt'],
        currentTime
      )(updatedState);
    } else {
      updatedState = R.assocPath<
        WorkingMemoryFormAnswerLog,
        WorkingMemoryFormState
      >(['answers', answerIndex + 1], {
        ...INITIAL_WORKING_MEMORY_FORM_ANSWER_LOG,
        startAt: currentTime,
      })(updatedState);
    }
    setSelectedId('');
    setInitialize(true);
    dispatch(updatedState);

    const isFinished =
      updatedState.currentIndex === state.cueCount + state.offset;

    if (isFinished) {
      handleSubmit(updatedState);
    }
  };
  return (
    <div style={{ display: 'grid', rowGap: 16 }}>
      <WorkingMemoryAnswerPaneMessage state={state} />
      <div
        ref={AnswerListRef}
        className={css({
          height: 260,
          display: 'flex',
          overflowY: 'scroll',
          justifyContent: 'center',
          opacity: 1,
          transition: 'all 0.3s ease-in-out',
          transform: 'translateY(0%)',
          '&.initial': {
            opacity: 0.1,
            transition: '0s',
            transform: 'translateY(30%)',
          },
        })}
      >
        <div>
          <div style={{ display: 'grid', rowGap: 16 }}>
            {Object.values(state.cues).map((cue) => (
              <WorkingMemoryAnswerCard
                key={cue.id}
                selected={selectedId === cue.id}
                pitchStr={cue.pitchStr}
                handleClick={() => handleTap(cue.id)}
              />
            ))}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          sx={{ color: 'white', width: 240 }}
          variant='contained'
          disabled={!selectedId}
          onClick={handleNext}
        >
          {state.currentIndex < state.cueCount ? '記住了' : '選好了'}
        </Button>
      </div>
      <WorkingMemoryFormFooter state={state} dispatch={dispatch} />
    </div>
  );
};

export default WorkingMemoryAnswerPane;
