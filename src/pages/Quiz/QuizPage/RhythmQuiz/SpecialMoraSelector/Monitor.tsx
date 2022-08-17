import { IconButton, useTheme } from '@mui/material';
import React from 'react';
import { useParams } from 'react-router-dom';
import { State } from '../../../../../Model';

const Monitor = ({
  state,
  questionIndex,
  wordIndex,
  syllableIndex,
}: {
  state: State;
  questionIndex: number;
  wordIndex: number;
  syllableIndex: number;
}) => {
  const theme = useTheme();
  const { quizId } = useParams();
  if (!quizId) return <></>;

  const { quizzes } = state;
  const quiz = quizzes[quizId];
  const { questions } = quiz;
  const question = questions[questionIndex];
  const { inputSpecialMoraArray } = question;
  const SPECIAL_MORAS = inputSpecialMoraArray[wordIndex];
  const specialMora = SPECIAL_MORAS[syllableIndex];

  return (
    <div style={{ margin: '-5px -8px 34px 0' }}>
      <div>
        <IconButton
          sx={{ ':hover': { backgroundColor: '#fee0eb' } }}
          size='small'
          disabled
          style={{
            width: specialMora.length === 2 ? 44 : 28,
            position: 'relative',
            textAlign: 'center',
            borderRadius: 4,
          }}
        >
          <span
            style={{
              ...(theme.typography as any).mPlusRounded,
              color: '#f50057',
              fontSize: 12,
              letterSpacing: 0,
            }}
          >
            {specialMora}
          </span>
        </IconButton>
      </div>
    </div>
  );
};

export default Monitor;
