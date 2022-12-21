import { SentencePitchLine } from '@chihatw/lang-gym-h.ui.sentence-pitch-line';
import { useTheme } from '@mui/material';
import React from 'react';
import SpeakerButton from '../../../commons/SpeakerButton';
import { QuizFormQuestion, QuizFormState } from '../../Model';
import WordPitch from './WordPitch';

const PitchQuiz = ({
  state,
  question,
  questionIndex,
  dispatch,
}: {
  state: QuizFormState;
  question: QuizFormQuestion;
  questionIndex: number;
  dispatch: React.Dispatch<QuizFormState>;
}) => {
  const theme = useTheme();
  return (
    <div style={{ display: 'grid', rowGap: 16 }}>
      {!!state.audioContext && !!state.quizBlob && (
        <SpeakerButton
          end={question.end}
          start={question.start}
          quizBlob={state.quizBlob}
          audioContext={state.audioContext}
        />
      )}
      <div
        style={{
          ...(theme.typography as any).notoSerifJP,
          fontSize: 14,
        }}
      >
        {question.japanese}
      </div>
      <SentencePitchLine pitchesArray={question.inputPitchesArray} />
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {question.inputPitchesArray.map((_, wordIndex) => (
          <WordPitch
            key={wordIndex}
            state={state}
            question={question}
            wordIndex={wordIndex}
            questionIndex={questionIndex}
            dispatch={dispatch}
          />
        ))}
      </div>
    </div>
  );
};

export default PitchQuiz;
