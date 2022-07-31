import { Button, useTheme } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { State } from '../../../Model';

const QuizPageHeader = ({
  state,
  isScore,
}: {
  state: State;
  isScore?: boolean;
}) => {
  return (
    <div style={{ display: 'grid', rowGap: 8 }}>
      <Title state={state} />
      <CreatedAt state={state} isScore={isScore} />
      {isScore && <BackButton />}
    </div>
  );
};

export default QuizPageHeader;

const Title = ({ state }: { state: State }) => {
  const { quiz } = state;
  const { title } = quiz;
  const theme = useTheme();
  return (
    <div
      style={{
        ...(theme.typography as any).notoSerifJP,
        fontSize: 24,
      }}
    >
      {title}
    </div>
  );
};

const CreatedAt = ({ state, isScore }: { state: State; isScore?: boolean }) => {
  const { quiz } = state;
  const { createdAt } = quiz;
  const theme = useTheme();
  const date = new Date(createdAt);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return (
    <div
      style={{
        ...(theme.typography as any).mPlusRounded300,
        fontSize: 12,
        color: '#777',
      }}
    >
      {`${year}年${month}月${day}日`}
    </div>
  );
};

const BackButton = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <div>
      <Button
        variant='contained'
        size='small'
        onClick={() => navigate('/quizzes/answered')}
        style={{
          ...(theme.typography as any).mPlusRounded,
          color: 'white',
          fontSize: 14,
          backgroundColor: '#52a2aa',
        }}
      >
        戻る
      </Button>
    </div>
  );
};
