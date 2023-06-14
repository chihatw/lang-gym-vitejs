import { useSelector } from 'react-redux';
import { useMemo } from 'react';

import { RootState } from 'main';
import AudioBufferSlider from 'views/components/AudioBufferSlider';
import AccentsAnswer from './AccentsAnswer';

function AccentsQuestionRow({
  questionId,
  index,
}: {
  questionId: string;
  index: number;
}) {
  const { quizId } = useSelector((state: RootState) => state.scorePage);
  const quizzes = useSelector((state: RootState) => state.quizzes);
  const quizQuestions = useSelector((state: RootState) => state.quizQuestions);
  const { fetchedAudioBuffers } = useSelector(
    (state: RootState) => state.audio
  );

  const quiz = useMemo(() => quizzes[quizId!] || null, [quizId, quizzes]);
  const question = useMemo(
    () => quizQuestions[questionId] || null,
    [questionId, quizQuestions]
  );
  const audioBuffer = useMemo(() => {
    if (!quiz) return null;
    return fetchedAudioBuffers[quiz.downloadURL] || null;
  }, [quiz, fetchedAudioBuffers]);
  return (
    <>
      {!!audioBuffer && (
        <AudioBufferSlider
          end={question.end}
          start={question.start}
          audioBuffer={audioBuffer}
        />
      )}
      <div style={{ display: 'grid', rowGap: 8 }}>
        <AccentsAnswer questionId={questionId} index={index} />
      </div>
    </>
  );
}

export default AccentsQuestionRow;
