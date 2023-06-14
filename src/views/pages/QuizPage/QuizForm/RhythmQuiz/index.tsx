import React from 'react';

import RhythmMonitor from './RhythmMonitor';
import SpeakerButton from '../../../../components/SpeakerButton';
import SpecialMoraSelector from './SpecialMoraSelector';
import { QuizFormState } from '../../Model';

const RhythmQuiz = ({
  state,
  questionIndex,
  dispatch,
}: {
  state: QuizFormState;
  questionIndex: number;
  dispatch: React.Dispatch<QuizFormState>;
}) => {
  const question = state.questions[questionIndex];
  const { syllablesArray, start, end } = question;
  return (
    <div>
      {!!state.quizBlob && (
        <SpeakerButton start={start} end={end} quizBlob={state.quizBlob} />
      )}

      <div style={{ padding: '0 8px', display: 'grid', rowGap: 24 }}>
        <RhythmMonitor state={state} questionIndex={questionIndex} />

        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {syllablesArray.map((_, wordIndex) => (
            <div key={wordIndex} style={{ display: 'flex' }}>
              {syllablesArray[wordIndex].map((_, syllableIndex) => (
                <SpecialMoraSelector
                  key={syllableIndex}
                  state={state}
                  wordIndex={wordIndex}
                  questionIndex={questionIndex}
                  syllableIndex={syllableIndex}
                  dispatch={dispatch}
                />
              ))}
              <div style={{ width: 16 }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RhythmQuiz;
