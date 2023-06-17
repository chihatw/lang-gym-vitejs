import { useTheme } from '@mui/material';
import { memo } from 'react';

const QuestionIndex = memo(({ index }: { index: number }) => {
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
});

export default QuestionIndex;
