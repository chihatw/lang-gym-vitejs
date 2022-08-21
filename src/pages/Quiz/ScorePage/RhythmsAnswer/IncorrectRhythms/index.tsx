import { useTheme } from '@mui/material';
import React from 'react';
import { Quiz, QuizScore, Syllable } from '../../../../../Model';
import CheckRhythms from './CheckRhythms';

const IncorrectRhythms = ({
  quiz,
  score,
  questionIndex,
}: {
  quiz: Quiz;
  score: QuizScore;
  questionIndex: number;
}) => {
  const theme = useTheme();

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

  return (
    <div style={{ display: 'grid', rowGap: 8 }}>
      <CheckRhythms quiz={quiz} questionIndex={questionIndex} score={score} />
      <div style={{ display: 'grid', rowGap: 8, padding: '0 8px' }}>
        <div
          style={{
            ...(theme.typography as any).mPlusRounded,
            color: '#52a2aa',
            fontSize: 12,
          }}
        >
          正解：
        </div>
        <div
          style={{
            rowGap: 8,
            display: 'grid',
          }}
        >
          {syllablesArray
            .filter(
              (wordSyllable, wordIndex) =>
                // 単語単位で走査。誤答分のみ表示
                JSON.stringify(answeredSpecialMoraArray[wordIndex]) !==
                JSON.stringify(
                  wordSyllable.map((syllable) => syllable.specialMora)
                )
            )
            .map((wordSyllable, wordIndex) => (
              <div
                style={{
                  ...(theme.typography as any).notoSerifJP,
                  fontSize: 14,
                  padding: '0 16px',
                }}
                key={wordIndex}
              >
                {wordSyllable.map((syllable, syllableIndex) => (
                  <span key={syllableIndex}>
                    <span>{syllable.kana}</span>
                    <span style={{ color: '#f50057' }}>
                      {syllable.specialMora}
                    </span>
                  </span>
                ))}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default IncorrectRhythms;
