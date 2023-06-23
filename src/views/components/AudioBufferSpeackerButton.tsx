import { GiSpeaker } from 'react-icons/gi';
import { IconButton } from '@mui/material';
import {
  createSourceNode,
  pauseSourceNode,
} from 'application/audioBuffers/core/2-services';
import { useRef, useState } from 'react';

function AudioBufferSpeackerButton({
  start,
  stop,
  audioBuffer,
}: {
  start: number;
  stop: number;
  audioBuffer: AudioBuffer;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const sourseNodeRef = useRef<AudioBufferSourceNode | undefined>(undefined);

  const play = async () => {
    const audioContext = new AudioContext();
    const sourceNode = await createSourceNode(audioBuffer, audioContext);
    sourceNode.onended = () => {
      setIsPlaying(false);
    };
    sourceNode.start(audioContext.currentTime, start);
    sourceNode.stop(audioContext.currentTime + audioBuffer.duration);

    setIsPlaying(true);
    sourseNodeRef.current = sourceNode;
  };

  const pause = () => {
    pauseSourceNode(sourseNodeRef);
    setIsPlaying(false);
  };

  const handlePlay = () => {
    isPlaying ? pause() : play();
  };
  return (
    <IconButton onClick={handlePlay}>
      <span style={{ color: '#86bec4' }}>
        <GiSpeaker />
      </span>
    </IconButton>
  );
}

export default AudioBufferSpeackerButton;
