import { useSelector } from 'react-redux';

import { RootState } from 'main';
import AudioBufferSlider from 'views/components/AudioBufferSlider';
import AccentsAnswer from './AccentsAnswer';
import { selectQuizAudioBuffer } from 'application/scorePage/framework/2-selector';
import { selectQuizQuestion } from 'application/quizQuestions/framework/2-selector';

function AccentsQuestionRow({
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
