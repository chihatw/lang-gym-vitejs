import { Container } from '@mui/material';
import React from 'react';

import FixedButton from './FixedButton';

const SentenceParseListWrapper = ({
  children,
  handleBack,
  isHideAppBar,
}: {
  children: React.ReactNode;
  isHideAppBar: boolean;
  handleBack: () => void;
}) => {
  if (isHideAppBar) {
    return (
      <div style={{ padding: '0 16px' }}>
        <FixedButton handleBack={handleBack} />
        {children}
      </div>
    );
  } else {
    return (
      <Container maxWidth='md'>
        <div style={{ height: 16 }} />
        <div>{children}</div>
      </Container>
    );
  }
};

export default SentenceParseListWrapper;
