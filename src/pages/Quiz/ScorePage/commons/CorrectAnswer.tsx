import CheckIcon from '@mui/icons-material/Check';
import { useTheme } from '@mui/material';
import React from 'react';

const CorrectAnswer = ({ children }: { children: React.ReactNode }) => {
  const theme = useTheme();
  return (
    <div
      style={{
        ...(theme.typography as any).notoSerifJP,
        color: '#52a2aa',
        fontSize: 14,
        display: 'flex',
        padding: 8,
        alignItems: 'center',
        background: '#eaf4f5',
        borderRadius: 4,
        justifyContent: 'space-between',
      }}
    >
      <div>{children}</div>
      <CheckIcon />
    </div>
  );
};

export default CorrectAnswer;
