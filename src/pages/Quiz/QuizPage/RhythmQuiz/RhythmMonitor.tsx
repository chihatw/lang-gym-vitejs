import { useTheme } from '@mui/material';
import React from 'react';
import { State } from '../../../../Model';

const RhythmMonitor = ({
  state,
  questionIndex,
}: {
  state: State;
  questionIndex: number;
}) => {
  const theme = useTheme();
  const { quiz } = state;
  const { questions } = quiz;
  const question = questions[questionIndex];
  const { syllablesArray, monitorSpecialMoraArray } = question;
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
            const { syllable: _syllable } = syllable;
            const monitor = monitorSpecialMoraArray[wordIndex][syllableIndex];
            return (
              <div key={syllableIndex}>
                <span style={{ whiteSpace: 'nowrap' }}>{_syllable}</span>
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
