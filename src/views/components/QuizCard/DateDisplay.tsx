import { useTheme } from '@mui/material';
import React from 'react';

const DateDisplay: React.FC<{
  title: string;
  createdAt: number;
}> = ({ createdAt, title }) => {
  const theme = useTheme();
  const date = new Date(createdAt);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return (
    <div
      style={{
        ...(theme.typography as any).mPlusRounded300,
        userSelect: 'none',
      }}
    >
      <div
        style={{ color: '#777', fontSize: 10 }}
      >{`${year}年${month}月${day}日`}</div>
      <div style={{ fontSize: 14 }}>{title}</div>
    </div>
  );
};

export default DateDisplay;
