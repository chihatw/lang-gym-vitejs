import AssignmentPitches from './AssignmentPitches';
import SentencePitches from './SentencePitches';
import { ISentence } from 'application/sentences/core/0-interface';

const PitchesPane = ({
  sentence,
  audioBuffer,
}: {
  sentence: ISentence;
  audioBuffer: AudioBuffer | null;
}) => {
  return (
    <div style={{ display: 'grid', rowGap: 8 }}>
      <SentencePitches sentence={sentence} audioBuffer={audioBuffer} />
      <AssignmentPitches sentenceId={sentence.id} />
    </div>
  );
};

export default PitchesPane;
