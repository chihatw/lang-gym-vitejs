import { Button, useTheme } from '@mui/material';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../../../App';
import { ActionTypes } from '../../../../Update';

const ScoreFooter = () => {
  const { dispatch } = useContext(AppContext);
  const theme = useTheme();
  const navigate = useNavigate();
  const handleClick = () => {
    if (!dispatch) return;
    dispatch({ type: ActionTypes.startFetching });
    navigate('/quiz/list/answered');
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
