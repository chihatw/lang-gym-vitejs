import { SentencePitchLine } from '@chihatw/lang-gym-h.ui.sentence-pitch-line';
import Check from '@mui/icons-material/Check';
import Clear from '@mui/icons-material/Clear';
import PlayArrow from '@mui/icons-material/PlayArrow';
import { IconButton } from '@mui/material';
import React from 'react';
import string2PitchesArray from 'string2pitches-array';
import { INITIAL_WORKING_MEMORY_CUE } from '../../../../../Model';
import { createSourceNode } from '../../../../../services/utils';
import { WorkingMemoryFormState } from '../../Model';

const WorkingMemoryResultAnswerRow = ({
  state,
  index,
}: {
  state: WorkingMemoryFormState;
  index: number;
}) => {
  const cueId = state.cueIds[index] || '';
  const cue = state.cues[cueId] || INITIAL_WORKING_MEMORY_CUE;
  const answerId = state.answers[index].tapped.slice(-1)[0] || '';
  const answer = state.cues[answerId] || INITIAL_WORKING_MEMORY_CUE;
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
          <AnswerRowPlayButton
            blob={state.blob}
            audioContext={state.audioContext}
            start={cue.start}
            end={cue.end}
          />
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
          <AnswerRowPlayButton
            blob={state.blob}
            audioContext={state.audioContext}
            start={answer.start}
            end={answer.end}
          />
        )}
      </div>
    </div>
  );
};

export default WorkingMemoryResultAnswerRow;

const AnswerRowPlayButton = ({
  blob,
  audioContext,
  start,
  end,
}: {
  blob: Blob;
  audioContext: AudioContext;
  start: number;
  end: number;
}) => {
  const play = async () => {
    const sourceNode = await createSourceNode(blob, audioContext);
    sourceNode.start(0, start, end - start);
  };

  return (
    <IconButton color='primary' onClick={play}>
      <PlayArrow />
    </IconButton>
  );
};
