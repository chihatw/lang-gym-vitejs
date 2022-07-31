import { useTheme } from '@mui/material';
import React from 'react';
import { State } from '../../../../../../../Model';
import { Action } from '../../../../../../../Update';
import ScoreRow from './ScoreRow';

const ScoreList = ({
  state,
  cardIndex,
  dispatch,
}: {
  state: State;
  cardIndex: number;
  dispatch: React.Dispatch<Action>;
}) => {
  const { quizzes } = state;
  const { answeredList } = quizzes;
  const card = answeredList[cardIndex];
  const { scores } = card;

  const theme = useTheme();
  return (
    <div>
      <div
        style={{
          ...(theme.typography as any).mPlusRounded300,
          color: '#777',
          fontSize: 12,
          userSelect: 'none',
        }}
      >
        結果
      </div>
      {scores.map((score, index) => (
        <ScoreRow
          key={index}
          state={state}
          cardIndex={cardIndex}
          scoreIndex={index}
          dispatch={dispatch}
        />
      ))}
    </div>
  );
};

export default ScoreList;
