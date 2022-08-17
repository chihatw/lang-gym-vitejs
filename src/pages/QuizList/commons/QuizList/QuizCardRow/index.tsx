import * as R from 'ramda';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from '@mui/material';
import React, { useContext } from 'react';
import { AppContext } from '../../../../../App';
import { State, UnansweredQuiz } from '../../../../../Model';
import { deleteQuestionSet } from '../../../../../services/quiz';
import { ActionTypes } from '../../../../../Update';
import QuizCard from './QuizCard';

const QuizCardRow = ({
  isAnswered,
  cardIndex,
}: {
  cardIndex: number;
  isAnswered?: boolean;
}) => {
  const { state, dispatch } = useContext(AppContext);
  const { quizzes } = state;
  const { answeredList, unansweredList } = quizzes;
  const cards = isAnswered ? answeredList : unansweredList;
  const card = cards[cardIndex];

  const { title, id } = card;
  const lastChar = title.slice(-1)[0];
  const isDeletable = !isAnswered && ['再', '々'].includes(lastChar);

  const handleDelete = async () => {
    if (!dispatch) return;
    if (window.confirm(`${title}を削除しますか？`)) {
      await deleteQuestionSet(id);
      const updatedList: UnansweredQuiz[] = unansweredList.filter(
        (item) => item.id !== id
      );
      const updatedState = R.compose(
        R.assocPath<UnansweredQuiz[], State>(
          ['quizzes', 'unansweredList'],
          updatedList
        )
      )(state);
      dispatch({ type: ActionTypes.setState, payload: updatedState });
    }
  };
  if (!isDeletable) {
    return <QuizCard cardIndex={cardIndex} isAnswered={isAnswered} />;
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 43px' }}>
      <QuizCard cardIndex={cardIndex} isAnswered={isAnswered} />
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
