import { Card, CardContent, useTheme } from '@mui/material';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../..';

import { ActionTypes } from '../../../../Update';

const ArticleRow = ({ index }: { index: number }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { state, dispatch } = useContext(AppContext);
  const { articleList } = state;
  const article = articleList[index];
  const { title, id, createdAt } = article;
  const date = new Date(createdAt);

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const openArticlePage = async () => {
    if (!dispatch) return;
    dispatch({ type: ActionTypes.startFetching });
    navigate(`/article/${id}`);
  };

  return (
    <Card
      sx={{
        cursor: 'pointer',
        WebkitTapHighlightColor: '#EAF4F5',
        '&:active,&:focus': { background: '#EAF4F5' },
      }}
      onClick={openArticlePage}
      elevation={0}
    >
      <CardContent>
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
      </CardContent>
    </Card>
  );
};

export default ArticleRow;
