import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { RootState } from 'main';

import RhythmMonitor from './RhythmMonitor';
import SpecialMoraSelector from './SpecialMoraSelector';
import AudioBufferSpeackerButton from 'views/components/AudioBufferSpeackerButton';

const RhythmQuiz = ({ questionId }: { questionId: string }) => {
  const { quizId, syllablesArrays } = useSelector(
    (state: RootState) => state.quizPage
  );
  const quizzes = useSelector((state: RootState) => state.quizzes);
  const quizQuestions = useSelector((state: RootState) => state.quizQuestions);
  const { fetchedAudioBuffers } = useSelector(
    (state: RootState) => state.audio
  );

  const quiz = useMemo(() => quizzes[quizId], [quizId, quizzes]);
  const question = useMemo(
    () => quizQuestions[questionId] || null,
    [questionId, quizQuestions]
  );

  const audioBuffer = useMemo(() => {
    if (!quiz) return null;
    return fetchedAudioBuffers[quiz.downloadURL] || null;
  }, [quiz, fetchedAudioBuffers]);

  const syllablesArray = useMemo(
    () => syllablesArrays[questionId],
    [questionId, syllablesArrays]
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
