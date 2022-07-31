import React from 'react';
import { State } from '../../../../Model';
import { Action } from '../../../../Update';
import RhythmMonitor from './RhythmMonitor';
import SpeakerButton from '../../commons/SpeakerButton';
import SpecialMoraSelector from './SpecialMoraSelector';

const RhythmQuiz = ({
  state,
  questionIndex,
  dispatch,
}: {
  state: State;
  questionIndex: number;
  dispatch: React.Dispatch<Action>;
}) => {
  const { quiz } = state;
  const { questions } = quiz;
  const question = questions[questionIndex];
  const { syllablesArray } = question;
  return (
    <div>
      <SpeakerButton state={state} questionIndex={questionIndex} />
      <div style={{ padding: '0 8px', display: 'grid', rowGap: 24 }}>
        <RhythmMonitor state={state} questionIndex={questionIndex} />

        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {syllablesArray.map((_, wordIndex) => (
            <div key={wordIndex} style={{ display: 'flex' }}>
              {syllablesArray[wordIndex].map((_, syllableIndex) => (
                <SpecialMoraSelector
                  key={syllableIndex}
                  state={state}
                  dispatch={dispatch}
                  questionIndex={questionIndex}
                  wordIndex={wordIndex}
                  syllableIndex={syllableIndex}
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
