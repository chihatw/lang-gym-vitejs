import { Button } from '@mui/material';
import React from 'react';

const ResetButton = ({ reset }: { reset: () => void }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Button variant='outlined' sx={{ width: 260 }} onClick={reset}>
        RESET
      </Button>
    </div>
  );
};

export default ResetButton;
