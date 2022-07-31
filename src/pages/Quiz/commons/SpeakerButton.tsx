import { GiSpeaker } from 'react-icons/gi';
import { IconButton } from '@mui/material';
import React, { useRef, useState } from 'react';
import { State } from '../../../Model';
import { createSourceNode } from '../../../services/utils';

const SpeakerButton = ({
  state,
  questionIndex,
}: {
  state: State;
  questionIndex: number;
}) => {
  const { quiz, audioContext } = state;
  const { questions, quizBlob } = quiz;
  const question = questions[questionIndex];
  const { start, end } = question;

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
