import { Button, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const BackButton = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <div>
      <Button
        variant='contained'
        size='small'
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
    </div>
  );
};

export default BackButton;
