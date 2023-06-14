import { Divider, useTheme } from '@mui/material';

import { Quiz } from '../../../../../../Model';
import CorrectAnswer from '../../commons/CorrectAnswer';
import SentencePitchLine from '../../../../../components/SentencePitchLine';
import PitchLine from '../../../../../components/PitchLine';
import string2PitchesArray from 'string2pitches-array';
import { useSelector } from 'react-redux';
import { RootState } from 'main';
import { useMemo } from 'react';

const AccentsAnswer = ({
  index,
  questionId,
}: {
  index: number;
  questionId: string;
}) => {
  const theme = useTheme();

  const { quizId, scoreCreatedAt } = useSelector(
    (state: RootState) => state.scorePage
  );
  const quizzes = useSelector((state: RootState) => state.quizzes);
  const quizScores = useSelector((state: RootState) => state.quizScores);
  const quizQuestions = useSelector((state: RootState) => state.quizQuestions);

  const quiz = useMemo(() => quizzes[quizId!] || null, [quizId, quizzes]);
  const score = useMemo(() => {
    if (!quiz) return null;
    return (
      quiz.scoreIds
        .map((scoreId) => quizScores[scoreId])
        .find((score) => score.createdAt === Number(scoreCreatedAt)) || null
    );
  }, [scoreCreatedAt, quiz]);
  const question = useMemo(
    () => quizQuestions[questionId] || null,
    [questionId]
  );

  if (!score) return <></>;

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
