import { Button, useTheme } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Action, ActionTypes } from '../../../Update';

const ScoreFooter = ({ dispatch }: { dispatch: React.Dispatch<Action> }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const handleClick = () => {
    dispatch({ type: ActionTypes.startFetching });
    navigate('/quizzes/answered');
  };
  return (
    <Button
      variant='contained'
      fullWidth
      onClick={handleClick}
      style={{
        ...(theme.typography as any).mPlusRounded,
        color: 'white',
        fontSize: 14,
        backgroundColor: '#52a2aa',
      }}
    >
      戻る
    </Button>
  );
};

export default ScoreFooter;
