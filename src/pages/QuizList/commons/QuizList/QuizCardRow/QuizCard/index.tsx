import { Card, CardContent } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AnsweredQuiz, State } from '../../../../../../Model';
import { Action, ActionTypes } from '../../../../../../Update';
import DateDisplay from './DateDisplay';
import ScoreList from './ScoreList';

const QuizCard = ({
  state,
  cardIndex,
  isAnswered,
  dispatch,
}: {
  state: State;
  isAnswered?: boolean;
  cardIndex: number;
  dispatch: React.Dispatch<Action>;
}) => {
  const { quizzes } = state;
  const { answeredList, unansweredList } = quizzes;
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
        dispatch({ type: ActionTypes.startFetching });
        navigate(`/quiz/${id}`);
      }}
      elevation={0}
    >
      <CardContent>
        <div style={{ display: 'grid', rowGap: 8 }}>
          <DateDisplay title={title} createdAt={createdAt} />
          {!!scores && (
            <ScoreList
              state={state}
              cardIndex={cardIndex}
              dispatch={dispatch}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizCard;
