import { Container } from '@mui/material';
import { Navigate, useLocation } from 'react-router-dom';
import React, { useContext, useEffect } from 'react';

import SentencePane from './SentencePane';
import ArticleHeader from './ArticleHeader';
import { ActionTypes } from '../../../Update';
import { getArticleState } from '../../../services/article';

import SkeletonPage from '../../../components/SkeletonPage';
import { AppContext } from '../../../App';

const ArticlePage = () => {
  const { state, dispatch } = useContext(AppContext);
  const { pathname } = useLocation();

  const articleId = pathname.split('/').slice(-1)[0];

  const { auth, isFetching, articlePage, memo } = state;
  const { uid } = auth;
  const { article, sentences } = articlePage;
  const { id } = article;

  useEffect(() => {
    if (!isFetching || !dispatch) return;
    const fetchData = async () => {
      const memorizedArticlePage = memo.articlePages[articleId];
      const articlePage =
        memorizedArticlePage || (await getArticleState(uid, articleId));
      dispatch({ type: ActionTypes.setArticle, payload: articlePage });
    };
    fetchData();
  }, [isFetching, articleId, memo, uid, dispatch]);

  if (!uid) return <Navigate to='/login' />;
  if (isFetching) return <SkeletonPage />;
  if (!id) return <Navigate to='/' />;
  return (
    <Container maxWidth='sm'>
      <div style={{ height: 48 }} />
      <div style={{ paddingTop: 16 }}>
        <div style={{ display: 'grid', rowGap: 8 }}>
          <ArticleHeader />
          {sentences.map((_, sentenceIndex) => (
            <SentencePane key={sentenceIndex} sentenceIndex={sentenceIndex} />
          ))}
        </div>
      </div>
    </Container>
  );
};

export default ArticlePage;
