import React from 'react';
import { QuizFormState } from '../../QuizPage/Model';

const CorrectRhythms = ({
  state,
  questionIndex,
}: {
  state: QuizFormState;
  questionIndex: number;
}) => {
  const { questions } = state;
  const question = questions[questionIndex];
  const { syllablesArray } = question;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {syllablesArray.map((syllableUnit, wordIndex) => (
        <div key={wordIndex} style={{ marginRight: 8 }}>
          {syllableUnit.map((syllable, syllableIndex) => {
            const { syllable: baseMora, mora: specialMora } = syllable;
            return (
              <span key={syllableIndex}>
                <span style={{ color: '#555' }}>{baseMora}</span>
                <span style={{ color: '#f50057' }}>{specialMora}</span>
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default CorrectRhythms;
