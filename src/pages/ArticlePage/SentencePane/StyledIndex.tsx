import { css } from '@emotion/css';
import { useTheme } from '@mui/material';
import React from 'react';

const Index: React.FC<{ label: number }> = ({ label }) => {
  const theme = useTheme();
  return (
    <div
      className={css({
        width: 20,
        textAlign: 'center',
        lineHeight: '20px',
        userSelect: 'none',
        borderRadius: 4,
        backgroundColor: '#86bec4',
      })}
    >
      <span
        style={{
          ...(theme.typography as any).lato900,
          color: 'white',
          fontSize: 14,
        }}
      >
        {label}
      </span>
    </div>
  );
};

export default Index;
