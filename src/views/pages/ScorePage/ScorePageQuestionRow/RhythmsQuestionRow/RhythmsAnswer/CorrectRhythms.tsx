import { useMemo } from 'react';

import { useSelector } from 'react-redux';
import { RootState } from 'main';

const CorrectRhythms = ({ questionId }: { questionId: string }) => {
  const quizQuestions = useSelector((state: RootState) => state.quizQuestions);

  const question = useMemo(
    () => quizQuestions[questionId] || null,
    [questionId, quizQuestions]
  );
  const syllablesArray = Object.values(question.syllables);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {syllablesArray.map((syllableUnit, wordIndex) => (
        <div key={wordIndex} style={{ marginRight: 8 }}>
          {syllableUnit.map((syllable, syllableIndex) => {
            return (
              <span key={syllableIndex}>
                <span style={{ color: '#555' }}>{syllable.kana}</span>
                <span style={{ color: '#f50057' }}>{syllable.specialMora}</span>
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default CorrectRhythms;
