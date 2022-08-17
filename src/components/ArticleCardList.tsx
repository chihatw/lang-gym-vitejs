import * as R from 'ramda';
import { Button, Card, CardContent, useTheme } from '@mui/material';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../App';
import { Article, ArticleListParams, State } from '../Model';
import { getArticleCards } from '../services/article';
import { ActionTypes } from '../Update';
import CustomLabel from './CustomLabel';

const ArticleCardList = ({ isTopPage }: { isTopPage?: boolean }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { state, dispatch } = useContext(AppContext);
  const { articleList, articleListParams, auth } = state;
  const { uid } = auth;
  const articles = isTopPage ? articleList.slice(0, 3) : articleList;
  const { hasMore, startAfter } = articleListParams;

  const showMore = async () => {
    if (!dispatch) return;

    if (isTopPage) {
      navigate('/article/list');
      return;
    }

    const { articles, params } = await getArticleCards(uid, 10, startAfter);

    const updatedState: State = R.compose(
      R.assocPath<Article[], State>(
        ['articleList'],
        articleList.concat(articles)
      ),
      R.assocPath<ArticleListParams, State>(['articleListParams'], params)
    )(state);
    dispatch({ type: ActionTypes.setState, payload: updatedState });
  };
  return (
    <div style={{ display: 'grid', rowGap: 8 }}>
      <CustomLabel label={isTopPage ? '最近の作文' : '作文一覧'} />
      {articles.map((_, index) => (
        <CardContainer key={index} index={index} />
      ))}
      {!!hasMore && (
        <div style={{ textAlign: 'right' }}>
          <Button
            onClick={showMore}
            sx={{
              ...(theme.typography as any).mPlusRounded300,
              color: '#52a2aa',
              fontSize: 12,
            }}
          >
            {isTopPage ? '一覧表示' : 'もっと表示'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ArticleCardList;

const CardContainer = ({ index }: { index: number }) => {
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
