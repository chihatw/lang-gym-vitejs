import * as R from 'ramda';
import { useTheme } from '@mui/material';
import React, { useState } from 'react';
import { ActionTypes } from '../../../../../../Update';
import Monitor from './Monitor';
import Selector from './Selector';
import ToggleSelectorIcon from './ToggleSelectorIcon';
import { QuizFormState } from '../../../Model';
import { QuizFormAction } from '../../../Update';

const SpecialMoraSelector = ({
  state,
  wordIndex,
  questionIndex,
  syllableIndex,
  dispatch,
}: {
  state: QuizFormState;
  wordIndex: number;
  syllableIndex: number;
  questionIndex: number;
  dispatch: React.Dispatch<QuizFormAction>;
}) => {
  const { questions } = state;
  const question = questions[questionIndex];
  const { syllablesArray, inputSpecialMoraArray, monitorSpecialMoraArray } =
    question;
  const wordSyllable = syllablesArray[wordIndex];
  const inputSpecialMoras = inputSpecialMoraArray[wordIndex];
  const syllable = wordSyllable[syllableIndex];
  const inputSpecialMora = inputSpecialMoras[syllableIndex];
  const specialMoras = inputSpecialMoraArray[wordIndex];
  const specialMora = specialMoras[syllableIndex];

  const [selected, setSelected] = useState(false);
  const handleToggle = () => {
    if (!dispatch) return;
    setSelected(!selected);
    const updatedInput = [...inputSpecialMoraArray];
    const updatedMonitor = [...monitorSpecialMoraArray];
    updatedInput[wordIndex][syllableIndex] = '';
    updatedMonitor[wordIndex][syllableIndex] = '';

    const updatedState = R.compose(
      R.assocPath<string[][], QuizFormState>(
        ['questions', questionIndex, 'inputSpecialMoraArray'],
        updatedInput
      ),
      R.assocPath<string[][], QuizFormState>(
        ['questions', questionIndex, 'monitorSpecialMoraArray'],
        updatedMonitor
      )
    )(state);
    dispatch({ type: ActionTypes.setState, payload: updatedState });
  };
  const theme = useTheme();

  return (
    <div style={{ display: 'flex', position: 'relative', marginBottom: 24 }}>
      <div
        style={{
          ...(theme.typography as any).mPlusRounded300,
          color: '#52a2aa',
          fontSize: 12,
          userSelect: 'none',
        }}
      >
        <div style={{ width: 32, textAlign: 'center' }}>{syllable.kana}</div>
        {<ToggleSelectorIcon handleToggle={handleToggle} />}
      </div>

      {/* 特殊拍が選択済の場合、特殊拍を表示する */}
      {!!inputSpecialMora && <Monitor specialMora={specialMora} />}

      {/* 特殊拍が未選択で、シラブルが選択されている場合、特殊拍の選択肢を表示*/}
      {!inputSpecialMora && selected && (
        <div style={{ paddingLeft: 16 }}>
          <Selector
            questionIndex={questionIndex}
            wordIndex={wordIndex}
            syllableIndex={syllableIndex}
            syllablesArray={syllablesArray}
            inputSpecialMoraArray={inputSpecialMoraArray}
            monitorSpecialMoraArray={monitorSpecialMoraArray}
          />
        </div>
      )}
    </div>
  );
};

export default SpecialMoraSelector;
