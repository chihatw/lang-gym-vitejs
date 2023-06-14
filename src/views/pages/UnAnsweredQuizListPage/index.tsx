import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, Container, useTheme } from '@mui/material';

import { RootState } from 'main';

import QuizCard from 'views/components/QuizCard';
import CustomLabel from 'views/components/CustomLabel';

const UnAnsweredQuizListPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const { unansweredIds } = useSelector((state: RootState) => state.quizList);

  return (
    <Container maxWidth='sm'>
      <div style={{ height: 48 }} />
      <div style={{ padding: '8px 0' }}>
        <Button
          style={{
            ...(theme.typography as any).mPlusRounded300,
            color: '#ccc',
          }}
          disabled
        >
          未回答
        </Button>
        <Button
          style={{
            ...(theme.typography as any).mPlusRounded300,
            color: '#52a2aa',
          }}
          onClick={() => navigate('/quiz/list/answered')}
        >
          回答済
        </Button>
      </div>
      <div style={{ display: 'grid', rowGap: 8 }}>
        <CustomLabel label='未回答' />
        {unansweredIds.map((quizId, index) => (
          <QuizCard quizId={quizId} key={index} />
        ))}
      </div>
    </Container>
  );
};

export default UnAnsweredQuizListPage;
