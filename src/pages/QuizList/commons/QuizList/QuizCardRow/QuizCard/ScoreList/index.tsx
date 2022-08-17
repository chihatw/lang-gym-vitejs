import { useTheme } from '@mui/material';
import React, { useContext } from 'react';
import { AppContext } from '../../../../../../../App';
import ScoreRow from './ScoreRow';

const ScoreList = ({ cardIndex }: { cardIndex: number }) => {
  const { state } = useContext(AppContext);
  const { quizList } = state;
  const { answeredList } = quizList;
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
      {scores.map((_, index) => (
        <ScoreRow key={index} cardIndex={cardIndex} scoreIndex={index} />
      ))}
    </div>
  );
};

export default ScoreList;
