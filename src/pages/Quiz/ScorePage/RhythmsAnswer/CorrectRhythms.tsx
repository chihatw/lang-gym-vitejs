import React from 'react';
import { Quiz, Syllable } from '../../../../Model';

const CorrectRhythms = ({
  quiz,
  questionIndex,
}: {
  quiz: Quiz;
  questionIndex: number;
}) => {
  const question = quiz.questions[questionIndex];
  const syllablesArray: Syllable[][] = [];
  for (const syllables of Object.values(question.syllables)) {
    syllablesArray.push(syllables);
  }

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {syllablesArray.map((syllableUnit, wordIndex) => (
        <div key={wordIndex} style={{ marginRight: 8 }}>
          {syllableUnit.map((syllable, syllableIndex) => {
            return (
              <span key={syllableIndex}>
                <span style={{ color: '#555' }}>{syllable.kana}</span>
                <span style={{ color: '#f50057' }}>{syllable.specialMora}</span>
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default CorrectRhythms;
