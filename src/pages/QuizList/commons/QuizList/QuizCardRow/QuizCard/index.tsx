import { Card, CardContent } from '@mui/material';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../../../../../App';
import { AnsweredQuiz } from '../../../../../../Model';
import { ActionTypes } from '../../../../../../Update';
import DateDisplay from './DateDisplay';
import ScoreList from './ScoreList';

const QuizCard = ({
  cardIndex,
  isAnswered,
}: {
  isAnswered?: boolean;
  cardIndex: number;
}) => {
  const { state, dispatch } = useContext(AppContext);
  const { quizList } = state;
  const { answeredList, unansweredList } = quizList;
  const cards = isAnswered ? answeredList : unansweredList;
  const card = cards[cardIndex];
  const navigate = useNavigate();
  const { id, title, createdAt } = card;
  const { scores } = card as AnsweredQuiz;
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
        navigate(`/quiz/${id}`);
      }}
      elevation={0}
    >
      <CardContent>
        <div style={{ display: 'grid', rowGap: 8 }}>
          <DateDisplay title={title} createdAt={createdAt} />
          {!!scores && <ScoreList cardIndex={cardIndex} />}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizCard;
