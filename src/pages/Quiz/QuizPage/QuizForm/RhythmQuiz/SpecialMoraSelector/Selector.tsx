import * as R from 'ramda';
import { IconButton } from '@mui/material';
import React, { useContext } from 'react';
import { AppContext } from '../../../../../../App';
import { State, Syllable } from '../../../../../../Model';
import {
  getKanaSpecialMora,
  SPECIAL_MORAS,
} from '../../../../../../services/quiz';
import { ActionTypes } from '../../../../../../Update';

const Selector = ({
  questionIndex,
  wordIndex,
  syllableIndex,
  syllablesArray,
  inputSpecialMoraArray,
  monitorSpecialMoraArray,
}: {
  questionIndex: number;
  wordIndex: number;
  syllableIndex: number;
  syllablesArray: Syllable[][];
  inputSpecialMoraArray: string[][];
  monitorSpecialMoraArray: string[][];
}) => {
  const { state, dispatch } = useContext(AppContext);
  const syllable = syllablesArray[wordIndex][syllableIndex];

  const handleClick = (specialMora: string) => {
    if (!dispatch) return;
    const monitorString = getKanaSpecialMora({
      mora: syllable.kana,
      fixedVowel: syllable.longVowel,
      specialMora,
    });
    const updatedInput = [...inputSpecialMoraArray];
    const updatedMonitor = [...monitorSpecialMoraArray];
    updatedInput[wordIndex][syllableIndex] = specialMora;
    updatedMonitor[wordIndex][syllableIndex] = monitorString;

    const updatedState = R.compose(
      R.assocPath<string[][], State>(
        ['quiz', 'questions', questionIndex, 'inputSpecialMoraArray'],
        updatedInput
      ),
      R.assocPath<string[][], State>(
        ['quiz', 'questions', questionIndex, 'monitorSpecialMoraArray'],
        updatedMonitor
      )
    )(state);
    dispatch({ type: ActionTypes.setState, payload: updatedState });
  };
  return (
    <div style={{ marginTop: -4 }}>
      {SPECIAL_MORAS.map((SPECIAL_MORA, itemIndex) => (
        <div
          key={itemIndex}
          style={{ marginBottom: itemIndex !== SPECIAL_MORAS.length ? 4 : 0 }}
        >
          <IconButton
            size='small'
            style={{
              width: 28,
              border: `1px solid #86bec4`,
              borderRadius: 4,
            }}
            onClick={() => handleClick(SPECIAL_MORA)}
          >
            <span
              style={{
                color: '#52a2aa',
                fontSize: 10,
                whiteSpace: 'nowrap',
              }}
            >
              {SPECIAL_MORA}
            </span>
          </IconButton>
        </div>
      ))}
    </div>
  );
};

export default Selector;
