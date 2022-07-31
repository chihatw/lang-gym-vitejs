import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from '@mui/material';
import React from 'react';
import { State, UnansweredQuiz } from '../../../../../Model';
import { deleteQuestionSet } from '../../../../../services/quiz';
import { Action, ActionTypes } from '../../../../../Update';
import QuizCard from './QuizCard';

const QuizCardRow = ({
  state,
  isAnswered,
  cardIndex,
  dispatch,
}: {
  state: State;
  cardIndex: number;
  isAnswered?: boolean;
  dispatch: React.Dispatch<Action>;
}) => {
  const { quizzes } = state;
  const { answeredList, unansweredList } = quizzes;
  const cards = isAnswered ? answeredList : unansweredList;
  const card = cards[cardIndex];

  const { title, id } = card;
  const lastChar = title.slice(-1)[0];
  const isDeletable = !isAnswered && ['再', '々'].includes(lastChar);

  const handleDelete = async () => {
    if (window.confirm(`${title}を削除しますか？`)) {
      await deleteQuestionSet(id);
      const updatedList: UnansweredQuiz[] = unansweredList.filter(
        (item) => item.id !== id
      );
      dispatch({
        type: ActionTypes.removeUnAnsweredQuiz,
        payload: updatedList,
      });
    }
  };
  if (!isDeletable) {
    return (
      <QuizCard
        state={state}
        cardIndex={cardIndex}
        isAnswered={isAnswered}
        dispatch={dispatch}
      />
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 43px' }}>
      <QuizCard
        state={state}
        cardIndex={cardIndex}
        isAnswered={isAnswered}
        dispatch={dispatch}
      />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <IconButton size='small' onClick={handleDelete}>
          <DeleteIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default QuizCardRow;
