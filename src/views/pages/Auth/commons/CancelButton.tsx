import { Button, useTheme } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const CancelButton = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  return (
    <Button
      variant='contained'
      fullWidth
      disableElevation
      style={{
        ...(theme.typography as any).mPlusRounded,
      }}
      onClick={() => navigate('/account')}
      sx={{ backgroundColor: '#e0e0e0', ':hover': { background: '#ccc' } }}
    >
      戻る
    </Button>
  );
};

export default CancelButton;
