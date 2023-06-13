import { useTheme } from '@mui/material';
import SentencePitchLine from '../../../../components/SentencePitchLine';
import { ISentence } from 'application/sentences/core/0-interface';
import AudioBufferSlider from 'views/components/AudioBufferSlider';

const SentencePitches = ({
  sentence,
  audioBuffer,
}: {
  sentence: ISentence;
  audioBuffer: AudioBuffer | null;
}) => {
  const theme = useTheme();
  return (
    <div
      style={{
        border: '1px solid #A9D1D5',
        padding: 8,
        borderRadius: 8,
      }}
    >
      <div
        style={{
          ...(theme.typography as any).mPlusRounded,
          color: '#52a2aa',
          fontSize: 12,
          marginBottom: 8,
        }}
      >
        音調:
      </div>
      {audioBuffer && (
        <div
          style={{
            display: 'grid',
            position: 'relative',
            marginLeft: -8,
            marginTop: -16,
          }}
        >
          <AudioBufferSlider
            end={sentence.end}
            start={sentence.start}
            audioBuffer={audioBuffer}
          />
        </div>
      )}
      <SentencePitchLine pitchStr={sentence.pitchStr} />
    </div>
  );
};

export default SentencePitches;
