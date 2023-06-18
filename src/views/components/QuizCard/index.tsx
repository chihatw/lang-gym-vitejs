import { useSelector } from 'react-redux';
import { Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { RootState } from 'main';

import ScoreList from './ScoreList';
import DateDisplay from './DateDisplay';
import { selectQuizByQuizId } from 'application/quizzes/framework/2-selector';

const QuizCard = ({ quizId }: { quizId: string }) => {
  const navigate = useNavigate();
  const quiz = useSelector((state: RootState) =>
    selectQuizByQuizId(state, quizId)
  );

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
