import * as R from 'ramda';
import { useTheme } from '@mui/material';
import React, { useContext, useState } from 'react';
import { AppContext } from '../../../../../App';
import { State } from '../../../../../Model';
import { ActionTypes } from '../../../../../Update';
import Monitor from './Monitor';
import Selector from './Selector';
import ToggleSelectorIcon from './ToggleSelectorIcon';
import { useParams } from 'react-router-dom';

const SpecialMoraSelector = ({
  questionIndex,
  wordIndex,
  syllableIndex,
}: {
  questionIndex: number;
  wordIndex: number;
  syllableIndex: number;
}) => {
  const { quizId } = useParams();
  if (!quizId) return <></>;
  const { state, dispatch } = useContext(AppContext);
  const { quizzes } = state;
  const quiz = quizzes[quizId];
  const { questions } = quiz;
  const question = questions[questionIndex];
  const { syllablesArray, inputSpecialMoraArray, monitorSpecialMoraArray } =
    question;
  const wordSyllable = syllablesArray[wordIndex];
  const inputSpecialMoras = inputSpecialMoraArray[wordIndex];
  const mora = wordSyllable[syllableIndex];
  const inputSpecialMora = inputSpecialMoras[syllableIndex];

  const { syllable } = mora;

  const [selected, setSelected] = useState(false);
  const handleToggle = () => {
    if (!dispatch) return;
    setSelected(!selected);
    const updatedInput = [...inputSpecialMoraArray];
    const updatedMonitor = [...monitorSpecialMoraArray];
    updatedInput[wordIndex][syllableIndex] = '';
    updatedMonitor[wordIndex][syllableIndex] = '';

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
        <div style={{ width: 32, textAlign: 'center' }}>{syllable}</div>
        {<ToggleSelectorIcon handleToggle={handleToggle} />}
      </div>

      {/* 特殊拍が選択済の場合、特殊拍を表示する */}
      {!!inputSpecialMora && (
        <Monitor
          state={state}
          questionIndex={questionIndex}
          wordIndex={wordIndex}
          syllableIndex={syllableIndex}
        />
      )}

      {/* 特殊拍が未選択で、シラブルが選択されている場合、特殊拍の選択肢を表示*/}
      {!inputSpecialMora && selected && (
        <div style={{ paddingLeft: 16 }}>
          <Selector
            questionIndex={questionIndex}
            wordIndex={wordIndex}
            syllableIndex={syllableIndex}
          />
        </div>
      )}
    </div>
  );
};

export default SpecialMoraSelector;
