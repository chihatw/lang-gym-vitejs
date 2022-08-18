import { useTheme } from '@mui/material';
import React from 'react';
import { ScoreState } from '../../../../../Model';
import { QuizFormState } from '../../../QuizPage/Model';
import CheckRhythms from './CheckRhythms';

const IncorrectRhythms = ({
  state,
  score,
  questionIndex,
}: {
  score: ScoreState;
  state: QuizFormState;
  questionIndex: number;
}) => {
  const theme = useTheme();
  const { questions } = state;
  const question = questions[questionIndex];
  const { answers } = score;
  const { id: questionId, syllablesArray } = question;

  const answer = answers[questionId];
  const answeredSpecialMoraArray = JSON.parse(answer);

  return (
    <div style={{ display: 'grid', rowGap: 8 }}>
      <CheckRhythms state={state} questionIndex={questionIndex} score={score} />
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
                JSON.stringify(wordSyllable.map((s) => s.mora))
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
                {wordSyllable.map((syllable, syllableIndex) => {
                  const { syllable: baseMora, mora: specialMora } = syllable;
                  return (
                    <span key={syllableIndex}>
                      <span>{baseMora}</span>
                      <span style={{ color: '#f50057' }}>{specialMora}</span>
                    </span>
                  );
                })}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default IncorrectRhythms;
