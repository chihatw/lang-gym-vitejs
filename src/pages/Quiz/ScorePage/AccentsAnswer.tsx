import { PitchLine } from '@chihatw/lang-gym-h.ui.pitch-line';
import { SentencePitchLine } from '@chihatw/lang-gym-h.ui.sentence-pitch-line';
import { Divider, useTheme } from '@mui/material';
import React from 'react';
import string2PitchesArray from 'string2pitches-array';
import { Quiz } from '../../../Model';
import CorrectAnswer from './commons/CorrectAnswer';

const AccentsAnswer = ({
  quiz,
  scoreId,
  questionIndex,
}: {
  quiz: Quiz;
  scoreId: string;
  questionIndex: number;
}) => {
  const theme = useTheme();

  const question = quiz.questions[questionIndex];
  const score = quiz.scores[Number(scoreId)];
  const answer = score.pitchAnswers[questionIndex];

  const correctPitchesArray = string2PitchesArray(question.pitchStr);
  const answeredPitchesArray = string2PitchesArray(answer);

  const isCorrect = question.pitchStr === answer;
  if (isCorrect) {
    return (
      <CorrectAnswer>
        <SentencePitchLine pitchesArray={correctPitchesArray} />
      </CorrectAnswer>
    );
  }

  return (
    <div style={{ display: 'grid', rowGap: 8 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {answeredPitchesArray.map((answeredWordPitches, wordIndex) => {
          const correctWordPitches = correctPitchesArray[wordIndex];
          const isCorrectWord =
            JSON.stringify(answeredWordPitches) ===
            JSON.stringify(correctWordPitches);
          return (
            <div
              key={wordIndex}
              style={{
                marginRight: 8,
                borderRadius: 4,
                backgroundColor: !isCorrectWord ? '#fee0eb' : '',
              }}
            >
              <PitchLine pitches={answeredWordPitches} />
            </div>
          );
        })}
      </div>
      <div>
        <div
          style={{
            ...(theme.typography as any).mPlusRounded,
            color: '#52a2aa',
            fontSize: 12,
          }}
        >
          正解：
        </div>
        <div>
          {correctPitchesArray.map((correctWordPitches, wordIndex) => {
            const answeredWordPitches = answeredPitchesArray[wordIndex];
            const isCorrectWord =
              JSON.stringify(correctWordPitches) ===
              JSON.stringify(answeredWordPitches);
            return (
              <div key={wordIndex}>
                {!isCorrectWord && (
                  <div>
                    <PitchLine pitches={correctWordPitches} />
                    <Divider />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AccentsAnswer;
