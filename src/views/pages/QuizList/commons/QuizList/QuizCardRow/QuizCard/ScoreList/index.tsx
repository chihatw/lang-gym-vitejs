import { useTheme } from '@mui/material';
import React from 'react';
import { Quiz } from '../../../../../../../../Model';
import ScoreRow from './ScoreRow';

const ScoreList = ({ quiz }: { quiz: Quiz }) => {
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
      {Object.values(quiz.scores)
        .sort((a, b) => b.createdAt - a.createdAt)
        .map((score, index) => (
          <ScoreRow key={index} score={score} quizId={quiz.id} />
        ))}
    </div>
  );
};

export default ScoreList;
