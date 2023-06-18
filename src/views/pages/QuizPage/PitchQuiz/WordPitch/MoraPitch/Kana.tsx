import { useTheme } from '@mui/material';
import React from 'react';

const Kana = ({ kana }: { kana: string }) => {
  const theme = useTheme();
  return (
    <div
      style={{
        ...(theme.typography as any).mPlusRounded,
        width: 32,
        color: '#52a2aa',
        fontSize: 12,
        textAlign: 'center',
        userSelect: 'none',
      }}
    >
      {kana}
    </div>
  );
};

export default React.memo(Kana);
