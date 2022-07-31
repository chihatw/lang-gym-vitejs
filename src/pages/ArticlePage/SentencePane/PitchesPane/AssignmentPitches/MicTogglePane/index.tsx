import ClearIcon from '@mui/icons-material/Clear';
import { Button, IconButton, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { State } from '../../../../../../Model';
import { Action } from '../../../../../../Update';
import RecButton from './RecButton';

const MicTogglePane = ({
  state,
  sentenceIndex,
  dispatch,
}: {
  state: State;
  sentenceIndex: number;
  dispatch: React.Dispatch<Action>;
}) => {
  const theme = useTheme();

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(!open);

  if (open) {
    return (
      <div
        style={{
          width: '100%',
          position: 'relative',
        }}
      >
        <RecButton
          state={state}
          sentenceIndex={sentenceIndex}
          dispatch={dispatch}
        />
        <div style={{ position: 'absolute', top: 0, right: 0 }}>
          <IconButton onClick={handleOpen} sx={{ color: '#52a2aa' }}>
            <ClearIcon />
          </IconButton>
        </div>
      </div>
    );
  }
  return (
    <div style={{ paddingTop: 8 }}>
      <Button
        fullWidth
        disableElevation
        size='small'
        variant='contained'
        sx={{
          backgroundColor: '#cbe3e6',
          ':hover': {
            backgroundColor: '#cbe3e6',
          },
        }}
        onClick={handleOpen}
      >
        <span
          style={{
            ...(theme.typography as any).mPlusRounded,
            color: '#52a2aa',
          }}
        >
          録音
        </span>
      </Button>
    </div>
  );
};

export default MicTogglePane;
