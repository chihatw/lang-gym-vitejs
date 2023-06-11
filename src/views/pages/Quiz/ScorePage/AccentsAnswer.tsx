import { Divider, useTheme } from '@mui/material';

import { Quiz } from '../../../../Model';
import CorrectAnswer from './commons/CorrectAnswer';
import SentencePitchLine from '../../../components/SentencePitchLine';
import PitchLine from '../../../components/PitchLine';
import string2PitchesArray from 'string2pitches-array';

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

  // const correctPitchesArray = string2PitchesArray(question.pitchStr);
  // const answeredPitchesArray = string2PitchesArray(answer);

  const isCorrect = question.pitchStr === answer;
  if (isCorrect) {
    return (
      <CorrectAnswer>
        <SentencePitchLine pitchStr={question.pitchStr} />
      </CorrectAnswer>
    );
  }

  return (
    <div style={{ display: 'grid', rowGap: 8 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        // todo check split
        {answer.split(' ').map((answeredWordPitchStr, wordIndex) => {
          // todo check split
          const correctWordPitchStr = question.pitchStr.split(' ')[wordIndex];
          const isCorrectWord = answeredWordPitchStr === correctWordPitchStr;
          return (
            <div
              key={wordIndex}
              style={{
                marginRight: 8,
                borderRadius: 4,
                backgroundColor: !isCorrectWord ? '#fee0eb' : '',
              }}
            >
              <PitchLine
                pitches={string2PitchesArray(answeredWordPitchStr)[0]}
              />
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
          {question.pitchStr
            .split(' ')
            .map((correctWordPitchStr, wordIndex) => {
              const answeredWordPitchStr = answer.split(' ')[wordIndex];
              const isCorrectWord =
                correctWordPitchStr === answeredWordPitchStr;
              return (
                <div key={wordIndex}>
                  {!isCorrectWord && (
                    <div>
                      <PitchLine
                        pitches={string2PitchesArray(correctWordPitchStr)[0]}
                      />
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
