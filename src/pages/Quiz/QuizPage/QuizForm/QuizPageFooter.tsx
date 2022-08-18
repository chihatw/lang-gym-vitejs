import { Button, useTheme } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const QuizPageFooter = ({ handleSubmit }: { handleSubmit: () => void }) => {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'grid', rowGap: 16 }}>
      <Button
        fullWidth
        variant='contained'
        onClick={handleSubmit}
        sx={{ backgroundColor: '#52a2aa' }}
      >
        <ButtonLabel label='送信' color='white' />
      </Button>
      <Button
        sx={{ backgroundColor: '#e0e0e0' }}
        fullWidth
        variant='contained'
        onClick={() => navigate('/quizzes')}
      >
        <ButtonLabel label='戻る' color='#777' />
      </Button>
    </div>
  );
};

export default QuizPageFooter;

const ButtonLabel = ({ label, color }: { label: string; color: string }) => {
  const theme = useTheme();
  return (
    <span
      style={{
        ...(theme.typography as any).mPlusRounded500,
        color,
        fontSize: 14,
      }}
    >
      {label}
    </span>
  );
};
