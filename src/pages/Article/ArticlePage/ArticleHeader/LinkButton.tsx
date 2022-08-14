import { Button, useTheme } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { State } from '../../../../Model';

const LinkButton = ({ state }: { state: State }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { articlePage } = state;
  const { article } = articlePage;

  const handleClickParse = () => {
    navigate(`/article/${article.id}/parse`);
  };

  return (
    <Button
      disableElevation
      size='small'
      sx={{
        backgroundColor: '#cbe3e6',
        ':hover': {
          backgroundColor: '#cbe3e6',
        },
      }}
      variant='contained'
      onClick={handleClickParse}
    >
      <span
        style={{
          ...(theme.typography as any).mPlusRounded,
          color: '#52a2aa',
        }}
      >
        文の形
      </span>
    </Button>
  );
};

export default LinkButton;
