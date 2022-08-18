import * as R from 'ramda';
import LabelIcon from '@mui/icons-material/Label';
import LabelOutlinedIcon from '@mui/icons-material/LabelOutlined';
import { IconButton } from '@mui/material';
import React from 'react';
import { changePitchesArray } from '../../../../../../../services/quiz';
import { ActionTypes } from '../../../../../../../Update';
import MoraSeparater from './MoraSeparater';
import { QuizFormAction } from '../../../../Update';
import { QuizFormState } from '../../../../Model';

const TouchIcon = ({
  state,
  wordIndex,
  moraIndex,
  questionIndex,
  dispatch,
}: {
  state: QuizFormState;
  wordIndex: number;
  moraIndex: number;
  questionIndex: number;
  dispatch: React.Dispatch<QuizFormAction>;
}) => {
  const { questions } = state;
  const question = questions[questionIndex];
  const { inputPitchesArray, disableds } = question;
  const disabled = disableds.includes(wordIndex);
  const wordPitches = inputPitchesArray[wordIndex];
  const mora = wordPitches[moraIndex];
  const next = wordPitches[moraIndex + 1];
  const isAccent = !!next && next.length === 1 && mora.length === 2;
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
    dispatch({ type: ActionTypes.setState, payload: updatedState });
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
