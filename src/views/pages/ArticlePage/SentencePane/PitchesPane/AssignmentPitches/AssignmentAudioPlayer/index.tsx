import { useTheme } from '@mui/material';

import RemoveAudioButton from './RemoveAudioButton';
import AudioBufferSlider from 'views/components/AudioBufferSlider';

const AssignmentAudioPlayer = ({
  sentenceId,
  assignmentAudioBuffer,
}: {
  sentenceId: string;
  assignmentAudioBuffer: AudioBuffer;
}) => {
  const theme = useTheme();
  return (
    <div
      style={{
        display: 'grid',
        columnGap: 8,
        gridTemplateColumns: '1fr 32px',
      }}
    >
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
          練習:
        </div>

        <div
          style={{
            display: 'grid',
            position: 'relative',
            marginLeft: -8,
            marginTop: -16,
          }}
        >
          {assignmentAudioBuffer && (
            <AudioBufferSlider
              end={assignmentAudioBuffer.duration}
              start={0}
              audioBuffer={assignmentAudioBuffer}
            />
          )}
        </div>
      </div>
      <RemoveAudioButton sentenceId={sentenceId} />
    </div>
  );
};

export default AssignmentAudioPlayer;
