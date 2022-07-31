import { useTheme } from '@mui/material';
import React from 'react';
import { State } from '../../../../../Model';

const CheckRhythms = ({
  state,
  questionIndex,
}: {
  state: State;
  questionIndex: number;
}) => {
  const { score, quiz } = state;
  const { questions } = quiz;
  const question = questions[questionIndex];
  const { answers } = score;
  const { id: questionId, syllablesArray } = question;

  const answer = answers[questionId];
  const answeredSpecialMoraArray = JSON.parse(answer);

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
          JSON.stringify(wordMora.map(({ mora: specialMora }) => specialMora));
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
                const { syllable: baseMora } = syllable;
                const answeredSpecialMora =
                  answeredSpecialMoraArray[wordIndex][syllableIndex];
                return (
                  <span key={syllableIndex}>
                    <span style={{ color: '#555' }}>{baseMora}</span>
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
