import { Hidden } from '@mui/material';

import React, { useContext } from 'react';

import Copyright from './Copyright';
import PageFooter from './PageFooter';
import PageHeader from './PageHeader';
import { AppContext } from '../../App';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { state } = useContext(AppContext);
  const { auth } = state;
  const { uid } = auth;

  return (
    <>
      <div>
        <div
          style={{
            display: 'flex',
            minHeight: 'calc(100vh - 56px)',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: '#fafafa',
          }}
        >
          <div style={{ overflowX: 'scroll' }}>{children}</div>
          {!!uid && <Copyright />}
        </div>
        <PageHeader />
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            zIndex: 100,
            width: '100vw',
          }}
        >
          <Hidden smUp>{!!uid && <PageFooter />}</Hidden>
        </div>
      </div>
    </>
  );
};

export default Layout;
