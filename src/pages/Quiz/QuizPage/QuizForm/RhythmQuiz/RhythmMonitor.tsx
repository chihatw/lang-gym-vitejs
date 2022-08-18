import { useTheme } from '@mui/material';
import React from 'react';
import { QuizFormState } from '../../Model';

const RhythmMonitor = ({
  state,
  questionIndex,
}: {
  state: QuizFormState;
  questionIndex: number;
}) => {
  const { questions } = state;
  const question = questions[questionIndex];
  const { syllablesArray, monitorSpecialMoraArray } = question;
  const theme = useTheme();
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
            const { syllable: kana } = syllable;
            const monitor = monitorSpecialMoraArray[wordIndex][syllableIndex];
            return (
              <div key={syllableIndex}>
                <span style={{ whiteSpace: 'nowrap' }}>{kana}</span>
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
