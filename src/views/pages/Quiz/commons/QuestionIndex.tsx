import { useTheme } from '@mui/material';
import React from 'react';

const QuestionIndex = ({ index }: { index: number }) => {
  const theme = useTheme();
  return (
    <div
      style={{
        ...(theme.typography as any).notoSerifJP,
        fontSize: 16,
        userSelect: 'none',
        marginLeft: '-0.5em',
      }}
    >{`（${index}）`}</div>
  );
};

export default QuestionIndex;
