import { Container } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import React, { useEffect, useMemo } from 'react';

import SentencePane from './SentencePane';
import ArticleHeader from './ArticleHeader';

import SkeletonPage from '../../components/SkeletonPage';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'main';
import { articlePageActions } from 'application/articlePage/framework/0-reducer';
import { ARTILCE_STORAGE_PATH } from 'application/audio/core/1-constants';
import CheckPane from './CheckPane';

const ArticlePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { articleId } = useParams();
  const { isLoading, isChecking } = useSelector(
    (state: RootState) => state.ariclePage
  );

  const articles = useSelector((state: RootState) => state.articles);
  const sentences = useSelector((state: RootState) => state.sentences);
  const articleSentenceIds = useSelector(
    (state: RootState) => state.articleSentenceIds
  );
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
    () => articleSentenceIds[articleId || ''] || [],
    [articleId, articleSentenceIds]
  );

  const { article, audioBuffer } = useMemo(() => {
    const article = articles[articleId!] || null;
    const path = ARTILCE_STORAGE_PATH + articleId;
    const audioBuffer = fetchedAudioBuffers[path] || null;
    return { article, audioBuffer };
  }, [articleId, articles, fetchedAudioBuffers]);

  if (isLoading) return <SkeletonPage />;
  if (!article) return <></>;
  if (isChecking) return <CheckPane audioBuffer={audioBuffer} />;

  return (
    <Container maxWidth='sm'>
      <div style={{ height: 48 }} />
      <div style={{ paddingTop: 16 }}>
        <div style={{ display: 'grid', rowGap: 8 }}>
          <ArticleHeader
            article={article}
            sentences={sentences}
            audioBuffer={audioBuffer}
            sentenceIds={sentenceIds}
          />
          {sentenceIds.map((sentenceId, index) => {
            const sentence = sentences[sentenceId];
            if (!sentence) return <React.Fragment key={index} />;
            return (
              <SentencePane
                key={index}
                article={article}
                sentence={sentence}
                audioBuffer={audioBuffer}
              />
            );
          })}
        </div>
      </div>
    </Container>
  );
};

export default ArticlePage;
