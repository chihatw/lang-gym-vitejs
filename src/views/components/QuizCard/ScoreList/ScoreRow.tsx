import 'dayjs/locale/ja';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Button, useTheme } from '@mui/material';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from 'main';

dayjs.extend(relativeTime);
dayjs.locale('ja');

const ScoreRow = ({ scoreId, quizId }: { scoreId: string; quizId: string }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const quizzes = useSelector((state: RootState) => state.quizzes);
  const quizScores = useSelector((state: RootState) => state.quizScores);

  const quiz = useMemo(() => quizzes[quizId], [quizId, quizzes]);
  const score = useMemo(() => quizScores[scoreId], [scoreId, quizScores]);

  if (!quiz || !score) return <></>;

  return (
    <Button
      fullWidth
      color='primary'
      sx={{
        ...(theme.typography as any).mPlusRounded300,
        color: '#52a2aa',
        display: 'grid',
        fontSize: 12,
        gridTemplateColumns: 'auto 1fr auto',
      }}
      onClick={(e) => {
        e.stopPropagation();
        navigate(`/quiz/${quizId}/score/${score.createdAt}`);
      }}
    >
      <span>
        {score.score === quiz.questionCount
          ? '全問正解'
          : Math.round((score.score / quiz.questionCount) * 100) + '%正解'}
      </span>
      <span className='center' />
      <span>{dayjs(score.createdAt).fromNow()}</span>
    </Button>
  );
};

export default ScoreRow;
