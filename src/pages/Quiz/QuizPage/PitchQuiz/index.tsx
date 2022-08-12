import { SentencePitchLine } from '@chihatw/lang-gym-h.ui.sentence-pitch-line';
import { useTheme } from '@mui/material';
import React, { useContext } from 'react';
import WordPitch from './WordPitch';
import { AppContext } from '../../../../App';

const PitchQuiz = ({ questionIndex }: { questionIndex: number }) => {
  const { state, dispatch } = useContext(AppContext);
  const theme = useTheme();
  const { quiz } = state;
  const { questions } = quiz;
  const question = questions[questionIndex];
  const { japanese, inputPitchesArray } = question;
  return (
    <div style={{ display: 'grid', rowGap: 16 }}>
      <div
        style={{
          ...(theme.typography as any).notoSerifJP,
          fontSize: 14,
        }}
      >
        {japanese}
      </div>
      <SentencePitchLine pitchesArray={inputPitchesArray} />
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {inputPitchesArray.map((_, index) => (
          <WordPitch
            key={index}
            wordIndex={index}
            questionIndex={questionIndex}
          />
        ))}
      </div>
    </div>
  );
};

export default PitchQuiz;
