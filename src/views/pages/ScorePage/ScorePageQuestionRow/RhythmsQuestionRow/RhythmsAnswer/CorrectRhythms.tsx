import { useSelector } from 'react-redux';

import { RootState } from 'main';

import { selectSyllablesArray } from 'application/quizQuestions/framework/2-selector';

const CorrectRhythms = ({ questionId }: { questionId: string }) => {
  const syllablesArray = useSelector((state: RootState) =>
    selectSyllablesArray(state, questionId)
  );

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
