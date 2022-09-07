import * as R from 'ramda';
import { SentencePitchLine } from '@chihatw/lang-gym-h.ui.sentence-pitch-line';
import Check from '@mui/icons-material/Check';
import Clear from '@mui/icons-material/Clear';
import PlayArrow from '@mui/icons-material/PlayArrow';
import { IconButton } from '@mui/material';
import React, { useContext } from 'react';
import string2PitchesArray from 'string2pitches-array';
import { PITCHES } from '../../../../../pitch';
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
  const cue = PITCHES[cueId];
  const answerId = state.log.practice[index + state.log.offset].selected;
  const answer = PITCHES[answerId];

  const handleClick = async (start: number, end: number, tapped: string) => {
    if (!state.audioContext || !state.blob) return;
    const sourceNode = await createSourceNode(state.blob, state.audioContext);
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
          color: answer.pitchStr === cue.pitchStr ? '#52a2aa' : '#f50057',
          lineHeight: 0,
        }}
      >
        {answer.pitchStr === cue.pitchStr ? <Check /> : <Clear />}
      </div>
      <div
        style={{
          flexBasis: 120,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <SentencePitchLine pitchesArray={string2PitchesArray(cue.pitchStr)} />
        {state.blob && state.audioContext && (
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
          background:
            answer.pitchStr === cue.pitchStr
              ? 'transparent'
              : 'rgba(255,0,0,0.1)',
        }}
      >
        <SentencePitchLine
          pitchesArray={string2PitchesArray(answer.pitchStr)}
        />
        {state.blob && state.audioContext && (
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
