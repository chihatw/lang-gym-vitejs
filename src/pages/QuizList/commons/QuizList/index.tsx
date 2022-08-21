import React from 'react';
import CustomLabel from '../../../../components/CustomLabel';
import { Quiz } from '../../../../Model';
import QuizCardRow from './QuizCardRow';

const QuizList = ({
  quizList,
  isAnswered,
}: {
  quizList: Quiz[];
  isAnswered?: boolean;
}) => {
  return (
    <div style={{ display: 'grid', rowGap: 8 }}>
      <CustomLabel label={isAnswered ? '回答済' : '未回答'} />
      {quizList.map((quiz, index) => (
        <QuizCardRow key={index} quiz={quiz} />
      ))}
    </div>
  );
};

export default QuizList;
