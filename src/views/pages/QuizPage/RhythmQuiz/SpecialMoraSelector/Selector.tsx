import { useDispatch, useSelector } from 'react-redux';
import { IconButton } from '@mui/material';

import { RootState } from 'main';

import { quizPageActions } from 'application/quizPage/framework/0-reducer';
import { SPECIAL_MORAS } from 'application/quizPage/core/1-constants';
import { selectSyllable } from 'application/quizPage/framework/2-selector';

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

  const syllable = useSelector((state: RootState) =>
    selectSyllable(state, { questionId, wordIndex, syllableIndex })
  );

  const handleClick = (specialMora: string) => {
    if (!syllable) return;
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

  if (!syllable) return <></>;
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
