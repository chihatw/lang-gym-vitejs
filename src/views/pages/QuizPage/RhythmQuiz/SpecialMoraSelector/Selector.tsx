import { useDispatch, useSelector } from 'react-redux';
import { useMemo } from 'react';
import { IconButton } from '@mui/material';

import { RootState } from 'main';

import { quizPageActions } from 'application/quizPage/framework/0-reducer';
import { SPECIAL_MORAS } from 'application/quizPage/core/1-constants';

const Selector = ({
  questionId,
  wordIndex,
  syllableIndex,
}: {
  questionId: string;
  wordIndex: number;
  syllableIndex: number;
}) => {
  const dispatch = useDispatch();
  const { syllablesArrays } = useSelector((state: RootState) => state.quizPage);

  const syllablesArray = useMemo(
    () => syllablesArrays[questionId],
    [questionId, syllablesArrays]
  );

  const syllable = useMemo(
    () => syllablesArray[wordIndex][syllableIndex],
    [syllablesArray, wordIndex, syllableIndex]
  );

  const handleClick = (specialMora: string) => {
    dispatch(
      quizPageActions.setSyllableSpecialMora({
        questionId,
        wordIndex,
        syllableIndex,
        specialMora,
        syllable,
      })
    );
  };

  if (!syllablesArray || !syllable) return <></>;
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
