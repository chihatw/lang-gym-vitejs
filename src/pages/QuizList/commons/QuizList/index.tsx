import React, { useContext } from 'react';
import { AppContext } from '../../../../App';
import CustomLabel from '../../../../components/CustomLabel';
import QuizCardRow from './QuizCardRow';

const QuizList = ({ isAnswered }: { isAnswered?: boolean }) => {
  const { state, dispatch } = useContext(AppContext);
  const { quizzes } = state;
  const { answeredList, unansweredList } = quizzes;
  const cards = isAnswered ? answeredList : unansweredList;
  return (
    <div style={{ display: 'grid', rowGap: 8 }}>
      <CustomLabel label={isAnswered ? '回答済' : '未回答'} />
      {cards.map((_, index) => (
        <QuizCardRow key={index} cardIndex={index} isAnswered={isAnswered} />
      ))}
    </div>
  );
};

export default QuizList;
