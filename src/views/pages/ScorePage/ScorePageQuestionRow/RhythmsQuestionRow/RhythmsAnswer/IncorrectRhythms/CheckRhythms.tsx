import { useMemo } from 'react';
import { useTheme } from '@mui/material';
import { useSelector } from 'react-redux';

import { RootState } from 'main';

const CheckRhythms = ({
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
  const score = useMemo(
    () =>
      quiz
        ? quiz.scoreIds
            .map((scoreId) => quizScores[scoreId])
            .find((score) => score.createdAt === Number(scoreCreatedAt)) || null
        : null,
    [scoreCreatedAt, quiz]
  );
  const question = useMemo(
    () => quizQuestions[questionId] || null,
    [questionId, quizQuestions]
  );

  const syllablesArray = useMemo(
    () => Object.values(question.syllables),
    [question]
  );

  const answeredSpecialMoraArray = useMemo(
    () =>
      score
        ? score.rhythmAnswers[index].split('\n').map((word) => word.split(','))
        : [],
    []
  );

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
