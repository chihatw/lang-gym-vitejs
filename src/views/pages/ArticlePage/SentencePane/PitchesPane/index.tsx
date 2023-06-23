import { useSelector } from 'react-redux';
import AssignmentPitches from './AssignmentPitches';
import SentencePitches from './SentencePitches';
import { RootState } from 'main';
import { selectSentenceById } from 'application/sentences/framework/0-reducer';

const PitchesPane = ({
  sentenceId,
  audioBuffer,
}: {
  sentenceId: string;
  audioBuffer: AudioBuffer | undefined;
}) => {
  const sentence = useSelector((state: RootState) =>
    selectSentenceById(state, sentenceId)
  );

  if (!sentence) return <></>;

  return (
    <div style={{ display: 'grid', rowGap: 8 }}>
      <SentencePitches sentence={sentence} audioBuffer={audioBuffer} />
      <AssignmentPitches sentenceId={sentenceId} />
    </div>
  );
};

export default PitchesPane;
