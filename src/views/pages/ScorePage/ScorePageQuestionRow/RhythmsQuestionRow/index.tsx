import { useDispatch, useSelector } from 'react-redux';
import { Container } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useMemo } from 'react';

import { RootState } from 'main';
import AudioBufferSpeackerButton from 'views/components/AudioBufferSpeackerButton';
import RhythmsAnswer from './RhythmsAnswer';

function RhythmsQuestionRow({
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
    <div>
      {!!audioBuffer && (
        <AudioBufferSpeackerButton
          start={question.start}
          stop={question.end}
          audioBuffer={audioBuffer}
        />
      )}

      <RhythmsAnswer questionId={questionId} index={index} />
    </div>
  );
}

export default RhythmsQuestionRow;
