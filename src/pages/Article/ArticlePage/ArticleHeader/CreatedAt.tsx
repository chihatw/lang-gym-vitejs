import { useTheme } from '@mui/material';
import React from 'react';
import { useParams } from 'react-router-dom';

import { State } from '../../../../Model';

const CreatedAt = ({ state }: { state: State }) => {
  const { articleId } = useParams();
  if (!articleId) return <></>;

  const { articlePages } = state;
  const articlePage = articlePages[articleId];
  const { article } = articlePage;
  const { createdAt } = article;
  const theme = useTheme();
  const date = new Date(createdAt);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return (
    <div
      style={{
        ...(theme.typography as any).mPlusRounded300,
        color: '#777',
        fontSize: 12,
      }}
    >
      {`${year}年${month}月${day}日`}
    </div>
  );
};

export default CreatedAt;
