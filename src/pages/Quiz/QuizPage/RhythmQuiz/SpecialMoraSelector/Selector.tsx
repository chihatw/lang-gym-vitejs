import { IconButton } from '@mui/material';
import React from 'react';
import { Question, State } from '../../../../../Model';
import {
  getKanaSpecialMora,
  SPECIAL_MORAS,
} from '../../../../../services/quiz';
import { Action, ActionTypes } from '../../../../../Update';

const Selector = ({
  state,
  dispatch,
  questionIndex,
  wordIndex,
  syllableIndex,
}: {
  state: State;
  dispatch: React.Dispatch<Action>;
  questionIndex: number;
  wordIndex: number;
  syllableIndex: number;
}) => {
  const { quiz } = state;
  const { questions } = quiz;
  const question = questions[questionIndex];
  const {
    syllablesArray,
    inputSpecialMoraArray,
    monitorSpecialMoraArray,
  }: Question = question;
  const syllable = syllablesArray[wordIndex][syllableIndex];
  const { syllable: mora, longVowel } = syllable;
  const handleClick = (specialMora: string) => {
    const monitorString = getKanaSpecialMora({
      mora,
      fixedVowel: longVowel,
      specialMora,
    });
    const updatedInput = [...inputSpecialMoraArray];
    const updatedMonitor = [...monitorSpecialMoraArray];
    updatedInput[wordIndex][syllableIndex] = specialMora;
    updatedMonitor[wordIndex][syllableIndex] = monitorString;
    dispatch({
      type: ActionTypes.inputSpecialMora,
      payload: {
        questionIndex,
        inputSpecialMoraArray: updatedInput,
        monitorSpecialMoraArray: updatedMonitor,
      },
    });
  };
  return (
    <div style={{ marginTop: -4 }}>
      {SPECIAL_MORAS.map((specialMora, itemIndex) => (
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
            onClick={() => handleClick(specialMora)}
          >
            <span
              style={{
                color: '#52a2aa',
                fontSize: 10,
                whiteSpace: 'nowrap',
              }}
            >
              {specialMora}
            </span>
          </IconButton>
        </div>
      ))}
    </div>
  );
};

export default Selector;
