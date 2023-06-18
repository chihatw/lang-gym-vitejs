import { useTheme } from '@mui/material';
import { useSelector } from 'react-redux';

import { RootState } from 'main';
import { selectMonitorSpecialMoraArray } from 'application/quizPage/framework/2-selector';
import { ISyllable } from 'application/quizQuestions/core/0-interface';
import { selectSyllablesArray } from 'application/quizQuestions/framework/2-selector';

const RhythmMonitor = ({ questionId }: { questionId: string }) => {
  const theme = useTheme();

  const syllablesArray = useSelector((state: RootState) =>
    selectSyllablesArray(state, questionId)
  );
  const monitorSpecialMoraArray = useSelector((state: RootState) =>
    selectMonitorSpecialMoraArray(state, questionId)
  );

  if (!syllablesArray || !monitorSpecialMoraArray) return <></>;

  const syllables = (
    syllable: ISyllable,
    wordIndex: number,
    syllableIndex: number
  ) => {
    const monitor = monitorSpecialMoraArray[wordIndex][syllableIndex];
    return (
      <div key={syllableIndex}>
        <span style={{ whiteSpace: 'nowrap' }}>{syllable.kana}</span>
        <span style={{ color: '#f50057', whiteSpace: 'nowrap' }}>
          {monitor}
        </span>
      </div>
    );
  };

  return (
    <div
      style={{
        ...(theme.typography as any).notoSerifJP,
        display: 'flex',
        fontSize: 12,
        flexWrap: 'wrap',
      }}
    >
      {syllablesArray.map((wordSyllable, wordIndex) => (
        <div style={{ display: 'flex' }} key={wordIndex}>
          {wordSyllable.map((syllable, syllableIndex) =>
            syllables(syllable, wordIndex, syllableIndex)
          )}
          <div style={{ width: 8 }} />
        </div>
      ))}
    </div>
  );
};

export default RhythmMonitor;
