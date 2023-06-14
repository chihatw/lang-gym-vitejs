import { Container } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useMemo } from 'react';

import SentencePane from './SentencePane';
import ArticleHeader from './ArticleHeader';

import SkeletonPage from '../../components/SkeletonPage';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'main';
import { articlePageActions } from 'application/articlePage/framework/0-reducer';
import { ARTILCE_STORAGE_PATH } from 'application/audio/core/1-constants';
import CheckPane from './CheckPane';
import { getSentenceIds } from 'application/sentences/core/2-services';

const ArticlePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { articleId } = useParams();
  const { isChecking } = useSelector((state: RootState) => state.ariclePage);

  const articles = useSelector((state: RootState) => state.articles);
  const sentences = useSelector((state: RootState) => state.sentences);
  const { fetchedAudioBuffers } = useSelector(
    (state: RootState) => state.audio
  );

  useEffect(() => {
    !articleId && navigate('/');
  }, [articleId]);

  useEffect(() => {
    if (!articleId) return;
    dispatch(articlePageActions.initiate(articleId));
  }, [articleId]);

  const sentenceIds = useMemo(
    () => (articleId ? getSentenceIds(articleId, sentences) : []),
    [articleId, sentences]
  );

  const { article, audioBuffer } = useMemo(() => {
    const article = articles[articleId!] || null;
    const path = ARTILCE_STORAGE_PATH + articleId;
    const audioBuffer = fetchedAudioBuffers[path] || null;
    return { article, audioBuffer };
  }, [articleId, articles, fetchedAudioBuffers]);

  if (!articleId) return <SkeletonPage />;
  if (!article) return <></>;
  if (isChecking) return <CheckPane audioBuffer={audioBuffer} />;

  return (
    <Container maxWidth='sm'>
      <div style={{ height: 48 }} />
      <div style={{ paddingTop: 16 }}>
        <div style={{ display: 'grid', rowGap: 8 }}>
          <ArticleHeader />
          {sentenceIds.map((sentenceId, index) => (
            <SentencePane key={index} sentenceId={sentenceId} />
          ))}
        </div>
      </div>
    </Container>
  );
};

export default ArticlePage;
