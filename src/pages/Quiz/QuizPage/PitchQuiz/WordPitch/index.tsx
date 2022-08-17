import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../../../../../App';
import MoraPitch from './MoraPitch';

const WordPitch = ({
  questionIndex,
  wordIndex,
}: {
  questionIndex: number;
  wordIndex: number;
}) => {
  const { quizId } = useParams();
  if (!quizId) return <></>;
  const { state } = useContext(AppContext);
  const { quizzes } = state;
  const quiz = quizzes[quizId];
  const { questions } = quiz;
  const question = questions[questionIndex];
  const { disableds, inputPitchesArray } = question;
  const wordPitches = inputPitchesArray[wordIndex];
  const disabled = disableds.includes(wordIndex);
  return (
    <div style={{ display: 'flex' }}>
      <div
        style={{
          display: 'flex',
          paddingTop: 8,
          marginBottom: 16,
          borderRadius: 4,
          backgroundColor: disabled ? '#eee' : 'transparent',
        }}
      >
        {wordPitches.map((_, moraIndex) => (
          <MoraPitch
            key={moraIndex}
            questionIndex={questionIndex}
            wordIndex={wordIndex}
            moraIndex={moraIndex}
          />
        ))}
      </div>
      <div style={{ width: 8 }} />
    </div>
  );
};

export default WordPitch;
