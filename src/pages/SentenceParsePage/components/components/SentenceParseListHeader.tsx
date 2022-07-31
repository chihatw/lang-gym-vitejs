import React from 'react';

import BackButton from './BackButton';
import ScreenToggleButtonGroup from './ScreenToggleButtonGroup';
import { IconButton, Tooltip } from '@mui/material';
import VolumeOff from '@mui/icons-material/VolumeOff';
import VolumeUp from '@mui/icons-material/VolumeUp';

const SentenceParseListHeader = ({
  title,
  createdAt,
  isHideAppBar,
  isMuted,
  onMute,
  handleBack,
  onToggleIsMiniScreen,
  isMiniScreen,
}: {
  title: string;
  createdAt: number;
  isHideAppBar: boolean;
  isMuted: boolean;
  isMiniScreen: boolean;
  onMute: () => void;
  handleBack: () => void;
  onToggleIsMiniScreen: () => void;
}) => {
  const date = new Date(createdAt);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return (
    <div>
      <TitleWrapper>{title}</TitleWrapper>
      <div style={{ height: 8 }} />

      <DateWrapper>{`${year}年${month}月${day}日`}</DateWrapper>
      <div style={{ height: 8 }} />

      {!isHideAppBar && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}
        >
          <BackButton handleBack={handleBack} />
          <div style={{ display: 'flex' }}>
            <Tooltip title={isMuted ? '消音解除' : '消音'}>
              <IconButton
                size='small'
                style={{ color: '#52a2aa' }}
                onClick={onMute}
              >
                {isMuted ? <VolumeOff /> : <VolumeUp />}
              </IconButton>
            </Tooltip>
            <div style={{ width: 8 }} />
            <ScreenToggleButtonGroup
              isMiniScreen={isMiniScreen}
              onToggleIsMiniScreen={onToggleIsMiniScreen}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SentenceParseListHeader;

const DateWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      style={{
        fontSize: 12,
        color: '#777',
        fontFamily: '"M PLUS Rounded 1c"',
        fontWeight: 300,
      }}
    >
      {children}
    </div>
  );
};

const TitleWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div style={{ fontFamily: 'Noto Serif JP', fontSize: 24 }}>{children}</div>
  );
};
