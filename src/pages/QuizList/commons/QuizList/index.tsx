import React from 'react';
import CustomLabel from '../../../../components/CustomLabel';
import { State } from '../../../../Model';
import { Action } from '../../../../Update';
import QuizCardRow from './QuizCardRow';

const QuizList = ({
  state,
  isAnswered,
  dispatch,
}: {
  state: State;
  isAnswered?: boolean;
  dispatch: React.Dispatch<Action>;
}) => {
  const { quizzes } = state;
  const { answeredList, unansweredList } = quizzes;
  const cards = isAnswered ? answeredList : unansweredList;
  return (
    <div style={{ display: 'grid', rowGap: 8 }}>
      <CustomLabel label={isAnswered ? '回答済' : '未回答'} />
      {cards.map((card, index) => (
        <QuizCardRow
          key={index}
          state={state}
          cardIndex={index}
          isAnswered={isAnswered}
          dispatch={dispatch}
        />
      ))}
    </div>
  );
};

export default QuizList;
