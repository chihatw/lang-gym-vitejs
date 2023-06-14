import { Container } from '@mui/material';
import React from 'react';
import QuestionIndex from '../../../components/QuestionIndex';
import QuizPageHeader from '../../../components/QuizPageHeader';
import { QuizFormState } from '../Model';
import PitchQuiz from './PitchQuiz';
import QuizPageFooter from './QuizPageFooter';
import RhythmQuiz from './RhythmQuiz';

const QuizForm = ({
  state,
  dispatch,
  handleSubmit,
}: {
  state: QuizFormState;
  dispatch: React.Dispatch<QuizFormState>;
  handleSubmit: () => void;
}) => {
  return (
    <Container maxWidth='sm'>
      <div style={{ height: 48 }} />
      <div style={{ paddingTop: 16, paddingBottom: 80 }}>
        <div style={{ display: 'grid', rowGap: 24 }}>
          <QuizPageHeader title={state.title} createdAt={state.createdAt} />
          {state.questions.map((question, questionIndex) => (
            <div key={questionIndex} style={{ display: 'grid', rowGap: 8 }}>
              <QuestionIndex index={questionIndex + 1} />
              {state.type === 'articleAccents' && (
                <PitchQuiz
                  state={state}
                  dispatch={dispatch}
                  question={question}
                  questionIndex={questionIndex}
                />
              )}
              {state.type === 'articleRhythms' && (
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
