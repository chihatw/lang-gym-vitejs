import { useTheme } from '@mui/material';
import CheckRhythms from './CheckRhythms';
import { useSelector } from 'react-redux';
import { RootState } from 'main';
import { selectAnsweredSpecialMoraArray } from 'application/quizPage/framework/2-selector';
import { selectSyllablesArray } from 'application/quizQuestions/framework/2-selector';

const IncorrectRhythms = ({
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
    <div style={{ display: 'grid', rowGap: 8 }}>
      <CheckRhythms index={index} questionId={questionId} />
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
