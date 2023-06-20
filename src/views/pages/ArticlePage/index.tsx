import { Container } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';

import SentencePane from './SentencePane';
import ArticleHeader from './ArticleHeader';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'main';
import { articlePageActions } from 'application/articlePage/framework/0-reducer';
import CheckPane from './CheckPane';
import {
  selectArticle,
  selectAudioBuffer,
  selectSentenceIds,
} from 'application/articlePage/framework/2-selector';

const ArticlePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { articleId } = useParams();
  const initializing = useSelector(
    (state: RootState) => state.ariclePage.initializing
  );
  const isChecking = useSelector(
    (state: RootState) => state.ariclePage.isChecking
  );

  const article = useSelector((state: RootState) => selectArticle(state));
  const sentenceIds = useSelector((state: RootState) =>
    selectSentenceIds(state)
  );
  const audioBuffer = useSelector((state: RootState) =>
    selectAudioBuffer(state)
  );

  useEffect(() => {
    return () => {
      dispatch(articlePageActions.clearState());
    };
  }, []);

  useEffect(() => {
    !articleId && navigate('/');
  }, [articleId]);

  useEffect(() => {
    if (!initializing) return;
    if (!articleId) return;
    // article, sentences, audioBuffer, assignmentAudioBuffers の取得
    dispatch(articlePageActions.initiate(articleId));
  }, [articleId, initializing]);

  if (!article) return <></>;
  if (isChecking) return <CheckPane audioBuffer={audioBuffer} />;

  const sentences = sentenceIds.map((sentenceId, index) => (
    <SentencePane key={index} sentenceId={sentenceId} />
  ));

  return (
    <Container maxWidth='sm'>
      <div style={{ height: 48 }} />
      <div style={{ paddingTop: 16 }}>
        <div style={{ display: 'grid', rowGap: 8 }}>
          <ArticleHeader />
          {sentences}
        </div>
      </div>
    </Container>
  );
};

export default ArticlePage;
