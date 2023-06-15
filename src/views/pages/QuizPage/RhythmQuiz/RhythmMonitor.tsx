import { useMemo } from 'react';
import { useTheme } from '@mui/material';
import { useSelector } from 'react-redux';

import { RootState } from 'main';

const RhythmMonitor = ({ questionId }: { questionId: string }) => {
  const theme = useTheme();
  const { syllablesArrays, monitorSpecialMoraArrays } = useSelector(
    (state: RootState) => state.quizPage
  );

  const syllablesArray = useMemo(
    () => syllablesArrays[questionId],
    [questionId, syllablesArrays]
  );
  const monitorSpecialMoraArray = useMemo(
    () => monitorSpecialMoraArrays[questionId],
    [questionId, monitorSpecialMoraArrays]
  );

  if (!syllablesArray || !monitorSpecialMoraArray) return <></>;

  return (
    <div
      style={{
        ...(theme.typography as any).notoSerifJP,
        display: 'flex',
        fontSize: 12,
        flexWrap: 'wrap',
      }}
    >
      {syllablesArray.map((_, wordIndex) => (
        <div style={{ display: 'flex' }} key={wordIndex}>
          {syllablesArray[wordIndex].map((syllable, syllableIndex) => {
            const monitor = monitorSpecialMoraArray[wordIndex][syllableIndex];
            return (
              <div key={syllableIndex}>
                <span style={{ whiteSpace: 'nowrap' }}>{syllable.kana}</span>
                <span style={{ color: '#f50057', whiteSpace: 'nowrap' }}>
                  {monitor}
                </span>
              </div>
            );
          })}
          <div style={{ width: 8 }} />
        </div>
      ))}
    </div>
  );
};

export default RhythmMonitor;
