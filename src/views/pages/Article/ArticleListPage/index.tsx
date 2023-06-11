import * as R from 'ramda';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Button, Container, useTheme } from '@mui/material';
import { useContext } from 'react';

import { AppContext } from '../../../../App';
import { getArticleList } from '../../../../application/services/article';
import { Article, ArticleListParams, State } from '../../../../Model';
import { ActionTypes } from '../../../../Update';
import CustomLabel from '../../../components/CustomLabel';
import ArticleRow from './ArticleRow';

const ArticleListPage = () => {
  const { pathname } = useLocation();
  const isTopPage = pathname === '/';

  const theme = useTheme();
  const navigate = useNavigate();
  const { state, dispatch } = useContext(AppContext);

  const { articleList, articleListParams } = state;

  const articles = isTopPage ? articleList.slice(0, 3) : articleList;
  const { hasMore, startAfter } = articleListParams;

  const showMore = async () => {
    if (!dispatch) return;

    if (isTopPage) {
      navigate('/article/list');
      return;
    }

    const { articles, params } = await getArticleList(
      state.auth.uid,
      10,
      startAfter
    );

    const updatedState: State = R.compose(
      R.assocPath<Article[], State>(
        ['articleList'],
        articleList.concat(articles)
      ),
      R.assocPath<ArticleListParams, State>(['articleListParams'], params)
    )(state);
    dispatch({ type: ActionTypes.setState, payload: updatedState });
  };

  if (!state.auth.uid) return <Navigate to='/login' />;
  return (
    <Container maxWidth='sm' sx={{ paddingTop: 2 }}>
      <div style={{ height: 48 }} className='dummyHeader' />
      <div style={{ display: 'grid', rowGap: 8 }}>
        <CustomLabel label={isTopPage ? '最近の作文' : '作文一覧'} />
        {articles.map((_, index) => (
          <ArticleRow key={index} index={index} />
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
    </Container>
  );
};

export default ArticleListPage;
