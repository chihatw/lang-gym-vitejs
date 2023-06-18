import { useSelector } from 'react-redux';

import { RootState } from 'main';

import RhythmsAnswer from './RhythmsAnswer';
import { selectQuizQuestion } from 'application/quizQuestions/framework/2-selector';
import { selectQuizAudioBuffer } from 'application/scorePage/framework/2-selector';
import AudioBufferSpeackerButton from 'views/components/AudioBufferSpeackerButton';

function RhythmsQuestionRow({
  questionId,
  index,
}: {
  questionId: string;
  index: number;
}) {
  const question = useSelector((state: RootState) =>
    selectQuizQuestion(state, questionId)
  );
  const audioBuffer = useSelector((state: RootState) =>
    selectQuizAudioBuffer(state)
  );

  if (!question) return <></>;

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
