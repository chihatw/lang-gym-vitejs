import { useSelector } from 'react-redux';

import { RootState } from 'main';

import RhythmsAnswer from './RhythmsAnswer';

import { selectQuizAudioBuffer } from 'application/scorePage/framework/2-selector';
import AudioBufferSpeackerButton from 'views/components/AudioBufferSpeackerButton';
import { selectQuestionById } from 'application/quizQuestions/framework/0-reducer';

function RhythmsQuestionRow({
  questionId,
  index,
}: {
  questionId: string;
  index: number;
}) {
  const question = useSelector((state: RootState) =>
    selectQuestionById(state, questionId)
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
