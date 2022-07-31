import LabelIcon from '@mui/icons-material/Label';
import LabelOutlinedIcon from '@mui/icons-material/LabelOutlined';
import { IconButton } from '@mui/material';
import React from 'react';
import { State } from '../../../../../../Model';
import { changePitchesArray } from '../../../../../../services/quiz';
import { Action, ActionTypes } from '../../../../../../Update';
import MoraSeparater from './MoraSeparater';

const TouchIcon = ({
  state,
  questionIndex,
  wordIndex,
  moraIndex,
  dispatch,
}: {
  state: State;
  questionIndex: number;
  wordIndex: number;
  moraIndex: number;
  dispatch: React.Dispatch<Action>;
}) => {
  const { quiz } = state;
  const { questions } = quiz;
  const question = questions[questionIndex];
  const { disableds, inputPitchesArray } = question;
  const disabled = disableds.includes(wordIndex);

  const wordPitches = inputPitchesArray[wordIndex];
  const mora = wordPitches[moraIndex];
  const next = wordPitches[moraIndex + 1];
  const isAccent = !!next && next.length === 1 && mora.length === 2;

  const handleClick = () => {
    const updated: string[][][] = changePitchesArray(
      inputPitchesArray,
      wordIndex,
      moraIndex
    );
    dispatch({
      type: ActionTypes.inputPitchesArray,
      payload: { questionIndex, pitchesArray: updated },
    });
  };

  return (
    <div style={{ left: 16, position: 'relative' }}>
      <IconButton size='small' disabled={disabled} onClick={handleClick}>
        {isAccent ? (
          <LabelIcon
            style={{
              color: '#f50057',
              position: 'relative',
              transform: 'rotate(270deg)',
            }}
          />
        ) : (
          <LabelOutlinedIcon
            style={{
              color: '#86bec4',
              position: 'relative',
              transform: 'rotate(270deg)',
            }}
          />
        )}
      </IconButton>
      <MoraSeparater isAccent={isAccent} />
    </div>
  );
};

export default TouchIcon;
