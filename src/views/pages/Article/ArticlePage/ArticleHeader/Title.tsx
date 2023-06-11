import { useTheme } from '@mui/material';
import React from 'react';
import { useParams } from 'react-router-dom';
import { State } from '../../../../../Model';

const Title = ({ state }: { state: State }) => {
  const { articleId } = useParams();
  if (!articleId) return <></>;
  const theme = useTheme();
  const { articlePages } = state;
  const articlePage = articlePages[articleId];
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
