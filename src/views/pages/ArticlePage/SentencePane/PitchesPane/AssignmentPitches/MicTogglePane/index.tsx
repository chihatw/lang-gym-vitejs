import ClearIcon from '@mui/icons-material/Clear';
import { Button, IconButton, useTheme } from '@mui/material';
import { useState } from 'react';
import RecButton from './RecButton';
import { useDispatch } from 'react-redux';
import { articlePageActions } from 'application/articlePage/framework/0-reducer';

const MicTogglePane = ({ sentenceId }: { sentenceId: string }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const handleOpenRecButton = () => {
    setOpen(true);
    dispatch(articlePageActions.setRecordSentenceId(sentenceId));
  };

  const handleCloseRecButton = () => {
    setOpen(false);
    dispatch(articlePageActions.setRecordSentenceId(''));
  };

  if (open) {
    return (
      <div
        style={{
          width: '100%',
          position: 'relative',
        }}
      >
        <RecButton />
        <div style={{ position: 'absolute', top: 0, right: 0 }}>
          <IconButton onClick={handleCloseRecButton} sx={{ color: '#52a2aa' }}>
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
        onClick={handleOpenRecButton}
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
