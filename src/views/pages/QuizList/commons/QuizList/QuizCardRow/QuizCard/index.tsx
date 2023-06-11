import { Card, CardContent } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Quiz } from '../../../../../../../Model';
import DateDisplay from './DateDisplay';
import ScoreList from './ScoreList';

const QuizCard = ({ quiz }: { quiz: Quiz }) => {
  const navigate = useNavigate();
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
          {!!Object.keys(quiz.scores).length && <ScoreList quiz={quiz} />}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizCard;
