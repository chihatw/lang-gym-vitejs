import * as R from 'ramda';
import { SentencePitchLine } from '@chihatw/lang-gym-h.ui.sentence-pitch-line';
import Check from '@mui/icons-material/Check';
import Clear from '@mui/icons-material/Clear';
import PlayArrow from '@mui/icons-material/PlayArrow';
import { IconButton } from '@mui/material';
import React, { useContext } from 'react';
import string2PitchesArray from 'string2pitches-array';
import { createSourceNode } from '../../../../../services/utils';
import { WorkingMemoryFormState } from '../../Model';
import { AppContext } from '../../../../../App';
import { useParams } from 'react-router-dom';
import { WorkingMemory } from '../../../../../Model';
import { setWorkingMemory } from '../../../../../services/workingMemory';

const WorkingMemoryResultAnswerRow = ({
  state,
  index,
  dispatch,
}: {
  state: WorkingMemoryFormState;
  index: number;
  dispatch: React.Dispatch<WorkingMemoryFormState>;
}) => {
  const { workoutId } = useParams();
  const { state: appState } = useContext(AppContext);
  if (!workoutId) return <></>;
  const cueId = state.cueIds[index];
  const cue = state.cards.find((item) => item.id === cueId);
  if (!cue) return <></>;
  const answerId = state.log.practice[index + state.log.offset].selected;
  const answer = state.cards.find((item) => item.id === answerId);
  if (!answer) return <></>;

  const handleClick = async (start: number, end: number, tapped: string) => {
    if (!state.audioContext || !state.pitchBlob || !state.toneBlob) return;
    const blob = cue.type === 'tone' ? state.toneBlob : state.pitchBlob;
    const sourceNode = await createSourceNode(blob, state.audioContext);
    sourceNode.start(0, start, end - start);

    let updatedTappeds: string[] = [];
    if (state.log.result.tappeds) {
      updatedTappeds = [...state.log.result.tappeds];
    }
    updatedTappeds.push(tapped);

    const updatedState = R.assocPath<string[], WorkingMemoryFormState>(
      ['log', 'result', 'tappeds'],
      updatedTappeds
    )(state);
    dispatch(updatedState);

    const updatedWorkingMemory = R.assocPath<string[], WorkingMemory>(
      ['logs', state.log.id, 'result', 'tappeds'],
      updatedTappeds
    )(appState.workingMemories[workoutId]);

    setWorkingMemory(updatedWorkingMemory);
  };

  const isCorrect = cue.id === answer.id;

  return (
    <div
      key={index}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div style={{ flexBasis: 32, textAlign: 'center' }}>{index + 1}</div>
      <div
        style={{
          flexBasis: 20,
          textAlign: 'center',
          color: isCorrect ? '#52a2aa' : '#f50057',
          lineHeight: 0,
        }}
      >
        {isCorrect ? <Check /> : <Clear />}
      </div>
      <div
        style={{
          flexBasis: 120,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        {!!cue.pitchStr && (
          <SentencePitchLine pitchesArray={string2PitchesArray(cue.pitchStr)} />
        )}
        {!!cue.label && (
          <div
            style={{
              fontSize: 16,
              lineHeight: '40px',
            }}
          >
            {cue.label}
          </div>
        )}
        {!!state.pitchBlob && !!state.toneBlob && !!state.audioContext && (
          <IconButton
            color='primary'
            onClick={() => handleClick(cue.start, cue.end, `cue_${cue.id}`)}
          >
            <PlayArrow />
          </IconButton>
        )}
      </div>
      <div
        style={{
          flexBasis: 120,
          display: 'flex',
          justifyContent: 'center',
          borderRadius: 4,
          background: isCorrect ? 'transparent' : 'rgba(255,0,0,0.1)',
        }}
      >
        {!!answer.pitchStr && (
          <SentencePitchLine
            pitchesArray={string2PitchesArray(answer.pitchStr)}
          />
        )}
        {!!answer.label && (
          <div style={{ fontSize: 16, lineHeight: '40px' }}>{answer.label}</div>
        )}
        {!!state.pitchBlob && !!state.toneBlob && state.audioContext && (
          <IconButton
            color='primary'
            onClick={() =>
              handleClick(answer.start, answer.end, `answer_${answer.id}`)
            }
          >
            <PlayArrow />
          </IconButton>
        )}
      </div>
    </div>
  );
};

export default WorkingMemoryResultAnswerRow;
