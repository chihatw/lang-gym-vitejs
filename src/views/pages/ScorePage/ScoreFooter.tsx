import { Button, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ScoreFooter = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Button
      variant='contained'
      fullWidth
      onClick={() => navigate('/quiz/list/answered')}
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
