import { IconButton, Tooltip } from '@mui/material';
import React from 'react';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

const SentenceHeader = ({
  line,
  mark,
  isMuted,
  ytPlayer,
  playerState,
  onMute,
  onPause,
}: {
  line: number;
  mark: string;
  isMuted: boolean;
  ytPlayer: any;
  playerState: number;
  onMute: () => void;
  onPause: () => void;
}) => {
  const onPlayFromSentenceTop = () => {
    const [mins, secs]: number[] = mark.split(':').map((i) => Number(i));
    ytPlayer.seekTo(mins * 60 + secs);
    if (playerState !== 1) {
      ytPlayer.playVideo();
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Index index={line + 1} />
      {!!mark && !!ytPlayer && (
        <div style={{ display: 'flex' }}>
          <div style={{ width: 16 }} />
          <Tooltip title='文頭から再生'>
            <IconButton
              size='small'
              style={{ margin: '-16px 0', color: '#ccc' }}
              onClick={() => onPlayFromSentenceTop()}
            >
              <PlayCircleFilledIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={playerState === 1 ? '停止' : '途中から再生'}>
            <IconButton
              size='small'
              style={{ margin: '-16px 0', color: '#ccc' }}
              onClick={onPause}
            >
              {playerState === 1 ? <PauseIcon /> : <PlayArrowIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip title={isMuted ? '消音解除' : '消音'}>
            <IconButton
              size='small'
              style={{ margin: '-16px 0', color: '#ccc' }}
              onClick={onMute}
            >
              {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
            </IconButton>
          </Tooltip>
        </div>
      )}
    </div>
  );
};

export default SentenceHeader;

const Index: React.FC<{ index: number }> = ({ index }) => {
  return (
    <div
      style={{
        width: 20,
        color: 'white',
        fontSize: 14,
        textAlign: 'center',
        fontWeight: 900,
        lineHeight: '20px',
        userSelect: 'none',
        fontFamily: '"Lato"',
        borderRadius: 4,
        backgroundColor: '#86bec4',
      }}
    >
      {index}
    </div>
  );
};
