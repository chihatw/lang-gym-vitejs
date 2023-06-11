import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';

import { Container } from '@mui/material';
import StyledButton from '../commons/StyledButton';
import QuizList from '../commons/QuizList';

import { AppContext } from '../../..';

const AnsweredPage = () => {
  const { state } = useContext(AppContext);

  const navigate = useNavigate();
  const answeredList = state.quizzes.filter(
    (item) => !!Object.keys(item.scores).length
  );

  return (
    <Container maxWidth='sm'>
      <div style={{ height: 48 }} />
      <div style={{ padding: '8px 0' }}>
        <StyledButton
          label='未回答'
          color='#52a2aa'
          handleClick={() => navigate('/quiz/list/unanswered')}
        />
        <StyledButton color='#ccc' disabled label='回答済' />
      </div>
      <QuizList isAnswered quizList={answeredList} />
    </Container>
  );
};

export default AnsweredPage;
