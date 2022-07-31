import { Button, ButtonGroup } from '@mui/material';
import React from 'react';

import '../styles/ScreenToggleButtonGroup.css';

const ScreenToggleButtonGroup = ({
  isMiniScreen,
  onToggleIsMiniScreen,
}: {
  isMiniScreen: boolean;
  onToggleIsMiniScreen: () => void;
}) => {
  return (
    <ButtonGroup>
      <Button
        color='primary'
        disableElevation
        size='small'
        style={{ borderColor: 'transparent' }}
        onClick={() => onToggleIsMiniScreen()}
        disabled={isMiniScreen}
        className='ScreenToggleButtonGroup-ToggleButton'
      >
        <div className='ScreenToggleButtonGroup-IconWrapper'>
          <div className='ScreenToggleButtonGroup-MiniScreen-Wrapper' />
          <div
            className='ScreenToggleButtonGroup-MiniScreen'
            style={{
              backgroundColor: isMiniScreen ? '#cbe3e6' : 'transparent',
            }}
          />
        </div>
      </Button>
      <Button
        size='small'
        style={{
          backgroundColor: 'transparent',
          borderColor: 'transparent',
        }}
        onClick={() => onToggleIsMiniScreen()}
        disabled={!isMiniScreen}
        className='ScreenToggleButtonGroup-ToggleButton'
      >
        <div className='ScreenToggleButtonGroup-IconWrapper'>
          <div
            className='ScreenToggleButtonGroup-OriginalScreen'
            style={{
              backgroundColor: isMiniScreen ? '#fafafa' : '#cbe3e6',
            }}
          />
        </div>
      </Button>
    </ButtonGroup>
  );
};

export default ScreenToggleButtonGroup;
