import * as R from 'ramda';
import { css } from '@emotion/css';
import PlayCircleRounded from '@mui/icons-material/PlayCircleRounded';
import { Button, IconButton } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { createSourceNode } from '../../../../services/utils';
import { WorkingMemoryFormState } from '../Model';
import WorkingMemoryFormFooter from './common/WorkingMemoryFormFooter';

const WorkingMemoryPlayButton = ({
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
  const currentCue = state.cards.find((item) => item.id === currentCueId);
  if (!currentCue) return <></>;

  const play = async () => {
    if (
      !state.pitchBlob ||
      !state.toneBlob ||
      !state.numberBlob ||
      !state.audioContext
    )
      return;

    const blob = (() => {
      switch (currentCue.type) {
        case 'tone':
          return state.toneBlob;
        case 'number':
          return state.numberBlob;
        default:
          return state.pitchBlob;
      }
    })();

    const sourceNode = await createSourceNode(blob, state.audioContext);
    sourceNode.start(0, currentCue.start, currentCue.end - currentCue.start);

    let updatedPlayedAts: number[] = [];
    if (state.log.practice[state.currentIndex].playedAts) {
      updatedPlayedAts = [...state.log.practice[state.currentIndex].playedAts];
    }
    updatedPlayedAts.push(Date.now());

    const updatedState = R.assocPath<number[], WorkingMemoryFormState>(
      ['log', 'practice', state.currentIndex, 'playedAts'],
      updatedPlayedAts
    )(state);
    dispatch(updatedState);
  };

  const handleClick = () => {
    // currentIndex のインクリメント
    // 次の log の初期化
    const nextIndex = state.currentIndex + 1;
    let updatedState = R.compose(
      R.assocPath<number, WorkingMemoryFormState>(['currentIndex'], nextIndex),
      R.assocPath<number, WorkingMemoryFormState>(
        ['log', 'practice', nextIndex, 'createdAt'],
        Date.now()
      )
    )(state);

    // 次から回答選択が始まる場合
    if (nextIndex === state.offset) {
      updatedState = R.assocPath<string, WorkingMemoryFormState>(
        ['scene'],
        'answer'
      )(updatedState);
    }
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
        {!!state.audioContext &&
        !!state.pitchBlob &&
        !!state.toneBlob &&
        !!state.numberBlob ? (
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

export default WorkingMemoryPlayButton;
