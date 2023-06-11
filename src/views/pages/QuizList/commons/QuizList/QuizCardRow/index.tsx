import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from '@mui/material';
import React, { useContext } from 'react';
import { AppContext } from '../../../../..';
import { Quiz, State } from '../../../../../../Model';
import { ActionTypes } from '../../../../../../Update';
import QuizCard from './QuizCard';
import { deleteQuiz } from '../../../../../../application/services/quiz';

const QuizCardRow = ({ quiz }: { quiz: Quiz }) => {
  const { state, dispatch } = useContext(AppContext);

  const { title, id: quizId } = quiz;
  const lastChar = title.slice(-1)[0];
  const isDeletable =
    !Object.keys(quiz.scores).length && ['再', '々'].includes(lastChar);

  const handleDelete = async () => {
    if (!dispatch) return;
    if (window.confirm(`${title}を削除しますか？`)) {
      await deleteQuiz(quizId);
      const updatedQuizzes = state.quizzes.filter((item) => item.id !== quizId);
      const updatedState: State = {
        ...state,
        quizzes: updatedQuizzes,
      };
      dispatch({ type: ActionTypes.setState, payload: updatedState });
    }
  };
  if (!isDeletable) {
    return <QuizCard quiz={quiz} />;
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 43px' }}>
      <QuizCard quiz={quiz} />
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
