import { Card, CardContent } from '@mui/material';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../../../../../App';
import { Quiz } from '../../../../../../Model';
import { ActionTypes } from '../../../../../../Update';
import DateDisplay from './DateDisplay';
import ScoreList from './ScoreList';

const QuizCard = ({ quiz }: { quiz: Quiz }) => {
  const navigate = useNavigate();
  const { dispatch } = useContext(AppContext);
  return (
    <Card
      sx={{
        cursor: 'pointer',
        WebkitTapHighlightColor: '#EAF4F5',
        '&:active,&:focus': { background: '#EAF4F5' },
      }}
      onClick={() => {
        if (!dispatch) return;
        dispatch({ type: ActionTypes.startFetching });
        navigate(`/quiz/${quiz.id}`);
      }}
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
