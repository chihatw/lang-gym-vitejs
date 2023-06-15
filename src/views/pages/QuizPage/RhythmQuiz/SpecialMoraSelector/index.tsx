import { useTheme } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useMemo, useState } from 'react';

import { RootState } from 'main';

import Monitor from './Monitor';
import Selector from './Selector';
import ToggleSelectorIcon from './ToggleSelectorIcon';
import { quizPageActions } from 'application/quizPage/framework/0-reducer';

const SpecialMoraSelector = ({
  wordIndex,
  questionId,
  syllableIndex,
}: {
  wordIndex: number;
  questionId: string;
  syllableIndex: number;
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const { syllablesArrays, inputSpecialMoraArrays } = useSelector(
    (state: RootState) => state.quizPage
  );

  const quizQuestions = useSelector((state: RootState) => state.quizQuestions);

  const question = useMemo(
    () => quizQuestions[questionId] || null,
    [questionId, quizQuestions]
  );
  const syllablesArray = useMemo(
    () => syllablesArrays[questionId],
    [questionId, syllablesArrays]
  );

  const inputSpecialMoraArray = useMemo(
    () => inputSpecialMoraArrays[questionId],
    [inputSpecialMoraArrays, questionId]
  );

  const syllable = syllablesArray[wordIndex][syllableIndex];
  const inputSpecialMora = inputSpecialMoraArray[wordIndex][syllableIndex];

  const disabled = question.disableds.includes(wordIndex);

  const [selected, setSelected] = useState(false);

  const handleToggle = () => {
    setSelected(!selected);
    dispatch(
      quizPageActions.clearSyllableSpecialMora({
        questionId,
        wordIndex,
        syllableIndex,
      })
    );
  };

  if (!syllable) return <></>;

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
        {<ToggleSelectorIcon handleToggle={handleToggle} disabled={disabled} />}
      </div>

      {/* 特殊拍が選択済の場合、特殊拍を表示する */}
      {!!inputSpecialMora && <Monitor specialMora={inputSpecialMora} />}

      {/* 特殊拍が未選択で、シラブルが選択されている場合、特殊拍の選択肢を表示*/}
      {!inputSpecialMora && selected && (
        <div style={{ paddingLeft: 16 }}>
          <Selector
            questionId={questionId}
            wordIndex={wordIndex}
            syllableIndex={syllableIndex}
          />
        </div>
      )}
    </div>
  );
};

export default SpecialMoraSelector;
