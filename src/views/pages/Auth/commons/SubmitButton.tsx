import { Button, useTheme } from '@mui/material';
import React from 'react';

const SubmitButton = ({ label }: { label: string }) => {
  const theme = useTheme();
  return (
    <Button type='submit' color='primary' variant='contained' fullWidth>
      <span
        style={{
          ...(theme.typography as any).mPlusRounded,
          color: 'white',
        }}
      >
        {label}
      </span>
    </Button>
  );
};

export default SubmitButton;
