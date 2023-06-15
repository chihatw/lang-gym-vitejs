import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, useTheme } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from 'main';

import { QUIZ_TIPE } from 'application/quizPage/core/1-constants';
import { quizPageActions } from 'application/quizPage/framework/0-reducer';

const QuizPageFooter = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { quizId } = useSelector((state: RootState) => state.quizPage);
  const quizzes = useSelector((state: RootState) => state.quizzes);

  const quiz = useMemo(() => quizzes[quizId] || null, [quizId, quizzes]);

  const handleSubmit = () => {
    if (!quiz) return;
    if (!Object.values(QUIZ_TIPE).includes(quiz.type)) return;
    const createdAt = Date.now();
    dispatch(quizPageActions.updateQuizScoreStart(createdAt));
    navigate(`/quiz/${quizId}/score/${createdAt}`);
  };

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
