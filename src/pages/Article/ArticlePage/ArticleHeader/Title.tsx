import { useTheme } from '@mui/material';
import React from 'react';
import { State } from '../../../../Model';

const Title = ({ state }: { state: State }) => {
  const theme = useTheme();
  const { articlePage } = state;
  const { article } = articlePage;
  const { title } = article;
  return (
    <div
      style={{
        ...(theme.typography as any).notoSerifJP,
        fontSize: 24,
      }}
    >
      {title}
    </div>
  );
};

export default Title;
