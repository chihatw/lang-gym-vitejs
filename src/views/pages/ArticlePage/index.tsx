import { Container } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';

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

  const article = useSelector(
    (state: RootState) => state.articles[articleId!] || null
  );
  const sentenceIds = useSelector((state: RootState) => {
    const sentences = state.sentences;
    return articleId ? getSentenceIds(articleId, sentences) : [];
  });
  const audioBuffer = useSelector((state: RootState) => {
    const { fetchedAudioBuffers } = state.audio;
    const path = ARTILCE_STORAGE_PATH + articleId;
    return fetchedAudioBuffers[path] || null;
  });

  useEffect(() => {
    !articleId && navigate('/');
  }, [articleId]);

  useEffect(() => {
    if (!articleId) return;
    // article, sentences, audioBuffer, assignmentAudioBuffers の取得
    dispatch(articlePageActions.initiate(articleId));
  }, [articleId]);

  if (!articleId) return <SkeletonPage />;
  if (!article) return <></>;
  if (isChecking) return <CheckPane audioBuffer={audioBuffer} />;

  const renderedSentences = sentenceIds.map((sentenceId, index) => (
    <SentencePane key={index} sentenceId={sentenceId} />
  ));

  return (
    <Container maxWidth='sm'>
      <div style={{ height: 48 }} />
      <div style={{ paddingTop: 16 }}>
        <div style={{ display: 'grid', rowGap: 8 }}>
          <ArticleHeader />
          {renderedSentences}
        </div>
      </div>
    </Container>
  );
};

export default ArticlePage;
