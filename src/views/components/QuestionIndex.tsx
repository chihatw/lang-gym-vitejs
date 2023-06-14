import { useTheme } from '@mui/material';

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
