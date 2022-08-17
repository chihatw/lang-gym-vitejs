import * as R from 'ramda';
import LabelIcon from '@mui/icons-material/Label';
import LabelOutlinedIcon from '@mui/icons-material/LabelOutlined';
import { IconButton } from '@mui/material';
import React, { useContext } from 'react';
import { AppContext } from '../../../../../../App';
import { changePitchesArray } from '../../../../../../services/quiz';
import { ActionTypes } from '../../../../../../Update';
import MoraSeparater from './MoraSeparater';
import { State } from '../../../../../../Model';

const TouchIcon = ({
  questionIndex,
  wordIndex,
  moraIndex,
}: {
  questionIndex: number;
  wordIndex: number;
  moraIndex: number;
}) => {
  const { state, dispatch } = useContext(AppContext);
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
    if (!dispatch) return;
    const updated: string[][][] = changePitchesArray(
      inputPitchesArray,
      wordIndex,
      moraIndex
    );
    const updatedState = R.compose(
      R.assocPath<string[][][], State>(
        ['quiz', 'questions', questionIndex, 'inputPitchesArray'],
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
