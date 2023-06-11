import { GiSpeaker } from 'react-icons/gi';
import { IconButton } from '@mui/material';
import React, { useRef, useState } from 'react';
import { createSourceNode } from '../../../../application/services/utils';

const SpeakerButton = ({
  start,
  end,
  quizBlob,
  audioContext,
}: {
  end: number;
  start: number;
  quizBlob: Blob;
  audioContext: AudioContext;
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const sourseNodeRef = useRef<AudioBufferSourceNode | null>(null);

  const play = async () => {
    if (!quizBlob || !audioContext) return;
    const sourceNode = await createSourceNode(quizBlob, audioContext);
    sourceNode.onended = () => {
      setIsPlaying(false);
    };
    sourceNode.start(0, start, end - start);
    setIsPlaying(true);
    sourseNodeRef.current = sourceNode;
  };
  const stop = () => {
    const sourceNode = sourseNodeRef.current;
    sourceNode && sourceNode.stop(0);
    sourseNodeRef.current = null;
    setIsPlaying(false);
  };
  const handlePlay = () => {
    isPlaying ? stop() : play();
  };

  return (
    <IconButton onClick={handlePlay}>
      <span style={{ color: '#86bec4' }}>
        <GiSpeaker />
      </span>
    </IconButton>
  );
};

export default SpeakerButton;
