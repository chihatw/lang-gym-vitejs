import { useSelector } from 'react-redux';

import { RootState } from 'main';

import RhythmMonitor from './RhythmMonitor';
import SpecialMoraSelector from './SpecialMoraSelector';
import AudioBufferSpeackerButton from 'views/components/AudioBufferSpeackerButton';
import { selectQuizAudioBuffer } from 'application/quizPage/framework/2-selector';
import { selectSyllablesArray } from 'application/quizQuestions/framework/2-selector';
import { selectQuestionById } from 'application/quizQuestions/framework/0-reducer';

const RhythmQuiz = ({ questionId }: { questionId: string }) => {
  const audioBuffer = useSelector((state: RootState) =>
    selectQuizAudioBuffer(state)
  );
  const question = useSelector((state: RootState) =>
    selectQuestionById(state, questionId)
  );
  const syllablesArray = useSelector((state: RootState) =>
    selectSyllablesArray(state, questionId)
  );

  if (!question || !syllablesArray) return <></>;

  return (
    <div>
      {!!audioBuffer && (
        <AudioBufferSpeackerButton
          start={question.start}
          stop={question.end}
          audioBuffer={audioBuffer}
        />
      )}

      <div style={{ padding: '0 8px', display: 'grid', rowGap: 24 }}>
        <RhythmMonitor questionId={questionId} />

        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {syllablesArray.map((_, wordIndex) => (
            <div key={wordIndex} style={{ display: 'flex' }}>
              {syllablesArray[wordIndex].map((_, syllableIndex) => (
                <SpecialMoraSelector
                  key={syllableIndex}
                  wordIndex={wordIndex}
                  questionId={questionId}
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
