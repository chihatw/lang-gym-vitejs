import * as R from 'ramda';
import { css } from '@emotion/css';
import { Button } from '@mui/material';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { createSourceNode } from '../../../../../../application/services/utils';
import { WorkingMemoryFormState } from '../../Model';
import WorkingMemoryAnswerCard from './WorkingMemoryAnswerCard';
import WorkingMemoryAnswerPaneMessage from './WorkingMemoryAnswerPaneMessage';
import WorkingMemoryFormFooter from '../common/WorkingMemoryFormFooter';
import { AppContext } from '../../../../../../App';
import {
  State,
  WorkingMemory,
  WorkingMemoryLog,
} from '../../../../../../Model';
import { useParams } from 'react-router-dom';
import { setWorkingMemory } from '../../../../../../application/services/workingMemory';
import { ActionTypes } from '../../../../../../Update';

const WorkingMemoryAnswerPane = ({
  state,
  dispatch,
}: {
  state: WorkingMemoryFormState;
  dispatch: React.Dispatch<WorkingMemoryFormState>;
}) => {
  const { workoutId } = useParams();
  const { state: appState, dispatch: appDispatch } = useContext(AppContext);
  if (!workoutId) return <></>;

  const currentCueId = state.cueIds[state.currentIndex];
  const currentCue = state.cards.find((item) => item.id === currentCueId);

  const [selectedId, setSelectedId] = useState('');
  const [initialize, setInitialize] = useState(true);

  const AnswerListRef = useRef<HTMLDivElement>(null);

  const cueCount = state.baseCueCount + state.step * state.offset;

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

    let _selectedId = '';
    if (selectedId !== cueId) {
      _selectedId = cueId;
    }
    setSelectedId(_selectedId);
    currentCue && play();
  };

  const play = async () => {
    if (
      !state.pitchBlob ||
      !state.toneBlob ||
      !state.numberBlob ||
      !state.audioContext ||
      !currentCue
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
  };

  const handleNext = () => {
    const currentTime = Date.now();

    // currentIndex のインクリメント
    // 回答の記録
    let updatedState = R.compose(
      R.assocPath<number, WorkingMemoryFormState>(
        ['currentIndex'],
        state.currentIndex + 1
      ),
      R.assocPath<string, WorkingMemoryFormState>(
        ['log', 'practice', state.currentIndex, 'selected'],
        selectedId
      )
    )(state);

    const isLast = state.currentIndex + 1 === cueCount + state.offset;
    // 次の問題がある場合
    if (!isLast) {
      updatedState = R.assocPath<number, WorkingMemoryFormState>(
        ['log', 'practice', state.currentIndex + 1, 'createdAt'],
        currentTime
      )(updatedState);
    }
    //　結果表示をする場合
    else {
      // 正解率の計算
      let correctCount = 0;
      Object.values(updatedState.log.practice).forEach((log, index) => {
        if (index - state.offset > -1) {
          if (log.selected === state.cueIds[index - state.offset]) {
            correctCount++;
          }
        }
      });
      const correctRatio = Math.round((correctCount / cueCount) * 100);

      // 次回オフセットの更新
      let updatedOffset = state.offset;
      if (correctRatio <= 65) {
        updatedOffset = Math.max(1, updatedOffset - 1);
      } else if (correctRatio >= 85) {
        updatedOffset++;
      }
      const updatedCueCount = state.baseCueCount + state.step * updatedOffset;

      // フォームステートの更新
      updatedState = R.compose(
        R.assocPath<number, WorkingMemoryFormState>(['offset'], updatedOffset),
        R.assocPath<number, WorkingMemoryFormState>(
          ['cueCount'],
          updatedCueCount
        ),
        R.assocPath<number, WorkingMemoryFormState>(
          ['log', 'correctRatio'],
          correctRatio
        ),
        R.assocPath<number, WorkingMemoryFormState>(
          ['log', 'result', 'createdAt'],
          currentTime
        ),
        R.assocPath<string, WorkingMemoryFormState>(['scene'], 'result')
      )(updatedState);

      // リモートの更新
      const updatedWorkingMemory = R.compose(
        R.assocPath<WorkingMemoryLog, WorkingMemory>(
          ['logs', updatedState.log.id],
          updatedState.log
        ),
        R.assocPath<number, WorkingMemory>(['offset'], updatedOffset),
        R.assocPath<number, WorkingMemory>(['cueCount'], updatedCueCount)
      )(appState.workingMemories[workoutId]);
      setWorkingMemory(updatedWorkingMemory);

      // アプリステートの更新
      const updatedAppState = R.assocPath<WorkingMemory, State>(
        ['workingMemories', workoutId],
        updatedWorkingMemory
      )(appState);
      appDispatch({ type: ActionTypes.setState, payload: updatedAppState });
    }

    setSelectedId('');
    setInitialize(true);
    dispatch(updatedState);
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
            {state.cards
              .filter((item) => state.cueRange.includes(item.id))
              .map((cue) => (
                <WorkingMemoryAnswerCard
                  key={cue.id}
                  selected={selectedId === cue.id}
                  pitchStr={cue.pitchStr}
                  label={cue.label}
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
          {state.currentIndex < cueCount ? '記住了' : '選好了'}
        </Button>
      </div>
      <WorkingMemoryFormFooter state={state} dispatch={dispatch} />
    </div>
  );
};

export default WorkingMemoryAnswerPane;
