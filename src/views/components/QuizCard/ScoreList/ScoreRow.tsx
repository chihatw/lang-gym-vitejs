import 'dayjs/locale/ja';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Button, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from 'main';
import { selectScoreById } from 'application/quizScores/framework/0-reducer';
import { selectQuizById } from 'application/quizzes/framework/0-reducer';

dayjs.extend(relativeTime);
dayjs.locale('ja');

const ScoreRow = ({ scoreId, quizId }: { scoreId: string; quizId: string }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const quiz = useSelector((state: RootState) => selectQuizById(state, quizId));
  const score = useSelector((state: RootState) =>
    selectScoreById(state, scoreId)
  );

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
