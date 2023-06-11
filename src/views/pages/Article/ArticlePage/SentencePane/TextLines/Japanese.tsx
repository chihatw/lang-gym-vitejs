import { useTheme } from '@mui/material';
import React from 'react';

const Japanese: React.FC<{ japanese: string }> = ({ japanese }) => {
  const theme = useTheme();
  return (
    <div
      style={{
        ...(theme.typography as any).notoSerifJP,
        fontSize: 14,
      }}
    >
      {japanese}
    </div>
  );
};

export default Japanese;
