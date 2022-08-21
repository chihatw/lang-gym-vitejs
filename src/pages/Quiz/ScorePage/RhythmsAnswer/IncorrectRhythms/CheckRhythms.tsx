import { useTheme } from '@mui/material';
import React from 'react';
import { Quiz, QuizScore, Syllable } from '../../../../../Model';

const CheckRhythms = ({
  score,
  quiz,
  questionIndex,
}: {
  score: QuizScore;
  quiz: Quiz;
  questionIndex: number;
}) => {
  const question = quiz.questions[questionIndex];
  const syllablesArray: Syllable[][] = [];
  for (const syllables of Object.values(question.syllables)) {
    syllablesArray.push(syllables);
  }

  const { rhythmAnswers } = score;

  const answer = rhythmAnswers[questionIndex];
  const answeredSpecialMoraArray = answer
    .split('\n')
    .map((word) => word.split(','));

  const theme = useTheme();
  return (
    <div
      style={{
        ...(theme.typography as any).notoSerifJP,
        fontSize: 14,
        display: 'flex',
        flexWrap: 'wrap',
      }}
    >
      {syllablesArray.map((wordMora, wordIndex) => {
        const answeredWordMora = answeredSpecialMoraArray[wordIndex];
        const isCorrect =
          JSON.stringify(answeredWordMora) ===
          JSON.stringify(wordMora.map(({ specialMora }) => specialMora));
        return (
          <div key={wordIndex} style={{ padding: '0 16px 16px 0' }}>
            <div
              style={{
                padding: '0 8px',
                borderRadius: 4,
                backgroundColor: isCorrect ? '#eaf4f5' : '#fee0eb',
              }}
            >
              {wordMora.map((syllable, syllableIndex) => {
                const answeredSpecialMora =
                  answeredSpecialMoraArray[wordIndex][syllableIndex];
                return (
                  <span key={syllableIndex}>
                    <span style={{ color: '#555' }}>{syllable.kana}</span>
                    <span style={{ color: '#f50057' }}>
                      {answeredSpecialMora}
                    </span>
                  </span>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CheckRhythms;
