import { Container } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useMemo } from 'react';

import SentencePane from './SentencePane';
import ArticleHeader from './ArticleHeader';

import SkeletonPage from '../../components/SkeletonPage';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'main';
import { articlePageActions } from 'application/articlePage/framework/0-reducer';

// debug ArticlePage
const ArticlePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { articleId } = useParams();
  const { isLoading } = useSelector((state: RootState) => state.ariclePage);
  const articleSentenceIds = useSelector(
    (state: RootState) => state.articleSentenceIds
  );

  const sentenceIds = useMemo(
    () => articleSentenceIds[articleId || ''] || [],
    [articleId, articleSentenceIds]
  );

  useEffect(() => {
    !articleId && navigate('/');
  }, [articleId]);

  useEffect(() => {
    if (!articleId) return;
    dispatch(articlePageActions.initiate(articleId));
  }, [articleId]);

  if (isLoading) return <SkeletonPage />;

  return (
    <Container maxWidth='sm'>
      <div style={{ height: 48 }} />
      <div style={{ paddingTop: 16 }}>
        <div style={{ display: 'grid', rowGap: 8 }}>
          <ArticleHeader />
          {/* {sentenceIds.map((sentenceId, index) => (
            <SentencePane key={index} sentenceIndex={0} />
          ))} */}
        </div>
      </div>
    </Container>
  );
};

export default ArticlePage;
