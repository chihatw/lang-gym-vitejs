import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { IconButton, Slider, useTheme } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { createSourceNode } from '../../../application/services/utils';
import TimePane from './TimePane';
import { currentTimeToSliderValue, sliderValueToCurrentTime } from './utils';

const BlobSlider = ({
  blob,
  spacer,
  duration,
}: {
  blob: Blob;
  spacer: number;
  duration: number;
}) => {
  const theme = useTheme();

  const [currentTime, setCurrentTime] = useState(0);
  const [sliderValue, setSliderValue] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const rafIdRef = useRef(0);
  const spacerRef = useRef(0);
  const sourseNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const startTimeRef = useRef(0);
  const offsetTimeRef = useRef(0);
  const pausedRef = useRef(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    return () => {
      pause();
    };
  }, []);

  const play = async () => {
    const audioContext = new AudioContext();
    audioContextRef.current = audioContext;
    if (!blob) return;
    const sourceNode = await createSourceNode(blob);

    // 停止された場合
    sourceNode.onended = () => {
      // 表示の変更
      setIsPlaying(false);
      window.cancelAnimationFrame(rafIdRef.current);
      if (!pausedRef.current) {
        setCurrentTime(0);
        setSliderValue(0);
        offsetTimeRef.current = 0;
      }
    };

    const offset = offsetTimeRef.current; // 開始位置を秒で指定
    sourceNode.start(0, offset);

    setIsPlaying(true);
    sourseNodeRef.current = sourceNode;
    startTimeRef.current = audioContext.currentTime;
    pausedRef.current = false;
    loop();
  };
  const loop = () => {
    const audioContext = audioContextRef.current;
    if (!audioContext) return;
    const startTime = startTimeRef.current;
    const currentTime =
      audioContext.currentTime - startTime + offsetTimeRef.current;

    setCurrentTime(currentTime);

    // 間引かないと slider の描画が更新されない
    if (spacerRef.current % spacer === 0) {
      setSliderValue(currentTimeToSliderValue(currentTime, duration));
    }

    rafIdRef.current = window.requestAnimationFrame(loop);
    spacerRef.current++;
  };

  const pause = () => {
    const audioContext = audioContextRef.current;
    const sourceNode = sourseNodeRef.current;
    sourceNode && sourceNode.stop(0);
    // AudioBufferSourceNodeは使い捨て
    sourseNodeRef.current = null;
    setIsPlaying(false);
    window.cancelAnimationFrame(rafIdRef.current);
    if (!audioContext) return;
    const offsetTime = audioContext.currentTime - startTimeRef.current;
    offsetTimeRef.current = offsetTime;
    pausedRef.current = true;
  };

  const handleChangeSliderValue = (value: number) => {
    setSliderValue(value);
    const currentTime = sliderValueToCurrentTime(value, duration);
    setCurrentTime(currentTime);
    offsetTimeRef.current = currentTime;
  };

  return (
    <div
      style={{
        ...(theme.typography as any).mPlusRounded,
        display: 'flex',
        fontSize: 12,
        alignItems: 'center',
        whiteSpace: 'nowrap',
      }}
    >
      <IconButton
        sx={{ color: '#86bec4' }}
        onClick={() => (isPlaying ? pause() : play())}
      >
        {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
      </IconButton>
      <TimePane current={currentTime} duration={duration} />
      <Slider
        sx={{ paddingTop: '14px', marginRight: '6px' }}
        color='primary'
        value={sliderValue}
        onChange={(_, value) => {
          handleChangeSliderValue(value as number);
        }}
      />
    </div>
  );
};

export default BlobSlider;
