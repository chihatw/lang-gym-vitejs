import React, { useContext } from 'react';
import { AppContext } from '../../../../App';
import CustomLabel from '../../../../components/CustomLabel';
import QuizCardRow from './QuizCardRow';

const QuizList = ({ isAnswered }: { isAnswered?: boolean }) => {
  const { state } = useContext(AppContext);
  const { quizList } = state;
  const { answeredList, unansweredList } = quizList;
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
