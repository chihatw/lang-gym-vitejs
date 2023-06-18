import { useTheme } from '@mui/material';
import { useSelector } from 'react-redux';

import { RootState } from 'main';
import { selectAnsweredSpecialMoraArray } from 'application/scorePage/framework/2-selector';
import { selectSyllablesArray } from 'application/quizQuestions/framework/2-selector';

const CheckRhythms = ({
  index,
  questionId,
}: {
  index: number;
  questionId: string;
}) => {
  const theme = useTheme();
  const syllablesArray = useSelector((state: RootState) =>
    selectSyllablesArray(state, questionId)
  );
  const answeredSpecialMoraArray = useSelector((state: RootState) =>
    selectAnsweredSpecialMoraArray(state, index)
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
