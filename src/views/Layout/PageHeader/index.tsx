import { AppBar, Toolbar, useMediaQuery } from '@mui/material';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../..';

import LogoButton from '../commons/LogoButton';
import PCContent from './PCContent';

const PageHeader = () => {
  const { state } = useContext(AppContext);
  const { auth } = state;
  const { uid } = auth;
  const matches = useMediaQuery('(min-width:600px)');
  const navigate = useNavigate();
  return (
    <AppBar
      elevation={0}
      sx={{
        backgroundColor: '#52a2aa',
        backgroundImage:
          'repeating-linear-gradient(135deg,transparent,transparent 10px,rgba(86, 171, 179, 1) 10px,rgba(86, 171, 179, 1) 20px)',
      }}
    >
      <Toolbar variant='dense' sx={{ display: 'grid' }}>
        {!!uid && matches ? (
          <PCContent />
        ) : (
          <div>
            <LogoButton handleClick={() => navigate('/')} />
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default PageHeader;
