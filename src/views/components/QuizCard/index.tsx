import { Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DateDisplay from './DateDisplay';
import ScoreList from './ScoreList';
import { useSelector } from 'react-redux';
import { RootState } from 'main';
import { useMemo } from 'react';

const QuizCard = ({ quizId }: { quizId: string }) => {
  const navigate = useNavigate();
  const quizzes = useSelector((state: RootState) => state.quizzes);
  const quiz = useMemo(() => quizzes[quizId], [quizId, quizzes]);

  if (!quiz) return <></>;

  return (
    <Card
      sx={{
        cursor: 'pointer',
        WebkitTapHighlightColor: '#EAF4F5',
        '&:active,&:focus': { background: '#EAF4F5' },
      }}
      onClick={() => navigate(`/quiz/${quiz.id}`)}
      elevation={0}
    >
      <CardContent>
        <div style={{ display: 'grid', rowGap: 8 }}>
          <DateDisplay title={quiz.title} createdAt={quiz.createdAt} />
          <ScoreList scoreIds={quiz.scoreIds} quizId={quizId} />
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizCard;
