import { Button } from '@mui/material';
import React from 'react';

const BackButton = ({ handleBack }: { handleBack: () => void }) => {
  return (
    <Button
      variant='contained'
      size='small'
      disableElevation
      style={{ backgroundColor: '#CBE3E6', color: '#52a2aa' }}
    >
      <div
        style={{
          fontFamily: '"M PLUS Rounded 1c"',
          fontWeight: 400,
        }}
        onClick={handleBack}
      >
        文の音
      </div>
    </Button>
  );
};

export default BackButton;
