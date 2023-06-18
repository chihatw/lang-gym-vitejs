import { useSelector } from 'react-redux';
import { Divider, useTheme } from '@mui/material';

import { RootState } from 'main';

import CorrectAnswer from '../../commons/CorrectAnswer';
import PitchLine from 'views/components/PitchLine';
import { selectScore } from 'application/scorePage/framework/2-selector';
import SentencePitchLine from 'views/components/SentencePitchLine';
import { selectQuizQuestion } from 'application/quizQuestions/framework/2-selector';

const AccentsAnswer = ({
  index,
  questionId,
}: {
  index: number;
  questionId: string;
}) => {
  const theme = useTheme();

  const score = useSelector((state: RootState) => selectScore(state));
  const question = useSelector((state: RootState) =>
    selectQuizQuestion(state, questionId)
  );

  if (!score || !question) return <></>;

  const answer = score.pitchAnswers[index];

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
        {answer.split(' ').map((answeredWordPitchStr, wordIndex) => {
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
              <PitchLine wordPitchStr={answeredWordPitchStr} />
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
                      <PitchLine wordPitchStr={correctWordPitchStr} />
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
