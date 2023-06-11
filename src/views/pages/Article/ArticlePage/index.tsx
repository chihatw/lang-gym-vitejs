import * as R from 'ramda';
import { Container } from '@mui/material';
import { Navigate, useParams } from 'react-router-dom';
import React, { useContext, useEffect } from 'react';

import SentencePane from './SentencePane';
import ArticleHeader from './ArticleHeader';
import { ActionTypes } from '../../../../Update';
import { getArticleState } from '../../../../application/services/article';

import SkeletonPage from '../../../components/SkeletonPage';
import { AppContext } from '../../../../App';
import { ArticleState, INITIAL_ARTICLE_STATE, State } from '../../../../Model';

const ArticlePage = () => {
  const { articleId } = useParams();
  if (!articleId) return <></>;
  const { state, dispatch } = useContext(AppContext);
  const { auth, isFetching, articlePages } = state;
  const { uid } = auth;
  const articlePage = articlePages[articleId] || INITIAL_ARTICLE_STATE;
  const { article, sentences } = articlePage;
  const { id } = article;

  useEffect(() => {
    if (!isFetching || !dispatch) return;
    const fetchData = async () => {
      const _articlePage = articlePage.article.id
        ? articlePage
        : await getArticleState(uid, articleId);

      const updatedState = R.compose(
        R.assocPath<boolean, State>(['isFetching'], false),
        R.assocPath<ArticleState, State>(
          ['articlePages', articleId],
          _articlePage
        )
      )(state);
      dispatch({ type: ActionTypes.setState, payload: updatedState });
    };
    fetchData();
  }, [articlePage.article, isFetching, uid]);

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
