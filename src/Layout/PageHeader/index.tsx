import { AppBar, Toolbar, useMediaQuery } from '@mui/material';
import React from 'react';
import { State } from '../../Model';
import { Action } from '../../Update';
import LogoButton from '../commons/LogoButton';
import SearchField from '../commons/SearchField';
import PCContent from './PCContent';

const PageHeader = ({
  state,
  dispatch,
}: {
  state: State;
  dispatch: React.Dispatch<Action>;
}) => {
  const { auth } = state;
  const { uid, initializing } = auth;
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
        {!initializing && !!uid ? (
          matches ? (
            <PCContent state={state} dispatch={dispatch} />
          ) : (
            <SearchField state={state} dispatch={dispatch} />
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
