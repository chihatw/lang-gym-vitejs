import { useSelector } from 'react-redux';
import AssignmentPitches from './AssignmentPitches';
import SentencePitches from './SentencePitches';
import { RootState } from 'main';

const PitchesPane = ({
  sentenceId,
  audioBuffer,
}: {
  sentenceId: string;
  audioBuffer: AudioBuffer | null;
}) => {
  const sentence = useSelector(
    (state: RootState) => state.sentences[sentenceId]
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
