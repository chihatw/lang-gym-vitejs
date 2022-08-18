import { Container } from '@mui/material';
import React from 'react';
import QuestionIndex from '../../commons/QuestionIndex';
import QuizPageHeader from '../../commons/QuizPageHeader';
import { QuizFormState } from '../Model';
import { QuizFormAction } from '../Update';
import PitchQuiz from './PitchQuiz';
import QuizPageFooter from './QuizPageFooter';
import RhythmQuiz from './RhythmQuiz';

const QuizForm = ({
  state,
  dispatch,
  handleSubmit,
}: {
  state: QuizFormState;
  dispatch: React.Dispatch<QuizFormAction>;
  handleSubmit: () => void;
}) => {
  const { title, questions, createdAt, type } = state;
  return (
    <Container maxWidth='sm'>
      <div style={{ height: 48 }} />
      <div style={{ paddingTop: 16, paddingBottom: 80 }}>
        <div style={{ display: 'grid', rowGap: 24 }}>
          <QuizPageHeader title={title} createdAt={createdAt} />
          {questions.map((_, questionIndex) => (
            <div key={questionIndex} style={{ display: 'grid', rowGap: 8 }}>
              <QuestionIndex index={questionIndex + 1} />
              {type === 'articleAccents' && (
                <PitchQuiz
                  state={state}
                  questionIndex={questionIndex}
                  dispatch={dispatch}
                />
              )}
              {type === 'articleRhythms' && (
                <RhythmQuiz
                  state={state}
                  dispatch={dispatch}
                  questionIndex={questionIndex}
                />
              )}
            </div>
          ))}
        </div>
        <div style={{ height: 32 }} />
        <QuizPageFooter handleSubmit={handleSubmit} />
      </div>
    </Container>
  );
};

export default QuizForm;
