import { useTheme } from '@mui/material';
import React from 'react';
import AudioSlider from '../../../../../components/AudioSlider';
import { QuizFormQuestion, QuizFormState } from '../../Model';
import WordPitch from './WordPitch';
import SentencePitchLine from '../../../../../components/SentencePitchLine';

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
        <AudioSlider
          end={question.end}
          start={question.start}
          blob={state.quizBlob}
          audioContext={state.audioContext}
          spacer={5}
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
      <SentencePitchLine pitchStr={question.inputPitchStr} />
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {/* todo check split */}
        {question.inputPitchStr.split(' ').map((_, wordIndex) => (
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
