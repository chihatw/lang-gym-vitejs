import { AppBar, Toolbar, useMediaQuery } from '@mui/material';
import React, { useContext } from 'react';
import { AppContext } from '../../App';
import { State } from '../../Model';
import { Action } from '../../Update';
import LogoButton from '../commons/LogoButton';
import SearchField from '../commons/SearchField';
import PCContent from './PCContent';

const PageHeader = () => {
  const { state, dispatch } = useContext(AppContext);
  const { auth } = state;
  const { uid } = auth;
  const matches = useMediaQuery('(min-width:600px)');
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
        {!!uid ? (
          matches ? (
            <PCContent />
          ) : (
            <SearchField />
          )
        ) : (
          <div>
            <LogoButton />
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default PageHeader;
