import { useTheme } from '@mui/material';
import React from 'react';

const CreatedAt = ({ createdAt }: { createdAt: number }) => {
  const theme = useTheme();
  const date = new Date(createdAt);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return (
    <div
      style={{
        ...(theme.typography as any).mPlusRounded300,
        fontSize: 12,
        color: '#777',
      }}
    >
      {`${year}年${month}月${day}日`}
    </div>
  );
};

export default CreatedAt;
