import { css } from '@emotion/css';
import { useTheme } from '@mui/material';
import * as React from 'react';

const Original: React.FC<{ original: string }> = ({ original }) => {
  const theme = useTheme();
  return (
    <div
      className={css({
        padding: '8px 16px',
        fontSize: 12,
        background: '#EAF4F5',
        borderRadius: 8,
      })}
    >
      <div
        style={{
          ...(theme.typography as any).mPlusRounded500,
          color: '#52a2aa',
        }}
      >
        原文：
      </div>
      <div
        style={{ ...(theme.typography as any).mPlusRounded, color: '#52a2aa' }}
      >
        {original}
      </div>
    </div>
  );
};

export default Original;
