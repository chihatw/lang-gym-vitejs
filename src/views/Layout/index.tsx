import { Box } from '@mui/material';

import React from 'react';

import Copyright from './Copyright';
import PageFooter from './PageFooter';
import PageHeader from './PageHeader';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
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
        <Copyright />
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
        <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
          <PageFooter />
        </Box>
      </div>
    </div>
  );
};

export default Layout;
