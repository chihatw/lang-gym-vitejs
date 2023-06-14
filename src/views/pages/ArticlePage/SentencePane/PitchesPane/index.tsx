import { useSelector } from 'react-redux';
import AssignmentPitches from './AssignmentPitches';
import SentencePitches from './SentencePitches';
import { RootState } from 'main';
import { useMemo } from 'react';

const PitchesPane = ({
  sentenceId,
  audioBuffer,
}: {
  sentenceId: string;
  audioBuffer: AudioBuffer | null;
}) => {
  const sentences = useSelector((state: RootState) => state.sentences);

  const sentence = useMemo(
    () => sentences[sentenceId],
    [sentenceId, sentences]
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
