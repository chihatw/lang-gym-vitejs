import React, { useContext } from 'react';

import RhythmMonitor from './RhythmMonitor';
import SpeakerButton from '../../commons/SpeakerButton';
import SpecialMoraSelector from './SpecialMoraSelector';
import { AppContext } from '../../../../App';
import { useParams } from 'react-router-dom';

const RhythmQuiz = ({ questionIndex }: { questionIndex: number }) => {
  const { quizId } = useParams();
  if (!quizId) return <></>;

  const { state } = useContext(AppContext);
  const { quizzes } = state;
  const quiz = quizzes[quizId];
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
