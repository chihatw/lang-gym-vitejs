import { useTheme } from '@mui/material';
import * as React from 'react';

const Chinese: React.FC<{ chinese: string }> = ({ chinese }) => {
  const theme = useTheme();
  return (
    <div
      style={{
        ...(theme.typography as any).mPlusRounded,
        color: '#52a2aa',
        fontSize: 12,
      }}
    >
      {chinese}
    </div>
  );
};

export default Chinese;
