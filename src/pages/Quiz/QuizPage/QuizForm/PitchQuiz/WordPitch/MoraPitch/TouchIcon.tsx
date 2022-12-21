import * as R from 'ramda';
import LabelIcon from '@mui/icons-material/Label';
import LabelOutlinedIcon from '@mui/icons-material/LabelOutlined';
import { IconButton } from '@mui/material';
import React from 'react';
import { changePitchesArray } from '../../../../../../../services/quiz';
import MoraSeparater from './MoraSeparater';
import { QuizFormState } from '../../../../Model';

const TouchIcon = ({
  state,
  isAccent,
  disabled,
  wordIndex,
  moraIndex,
  questionIndex,
  inputPitchesArray,
  dispatch,
}: {
  state: QuizFormState;
  isAccent: boolean;
  disabled: boolean;
  wordIndex: number;
  moraIndex: number;
  questionIndex: number;
  inputPitchesArray: string[][][];
  dispatch: React.Dispatch<QuizFormState>;
}) => {
  const handleClick = () => {
    if (!dispatch) return;
    const updated: string[][][] = changePitchesArray(
      inputPitchesArray,
      wordIndex,
      moraIndex
    );
    const updatedState = R.compose(
      R.assocPath<string[][][], QuizFormState>(
        ['questions', questionIndex, 'inputPitchesArray'],
        updated
      )
    )(state);
    dispatch(updatedState);
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
