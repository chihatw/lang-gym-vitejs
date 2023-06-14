import { useMemo } from 'react';
import { Divider } from '@mui/material';

import Title from './Title';
import CreatedAt from './CreatedAt';
import AudioBufferSlider from 'views/components/AudioBufferSlider';

import { useSelector } from 'react-redux';
import { RootState } from 'main';
import { ARTILCE_STORAGE_PATH } from 'application/audio/core/1-constants';

const ArticleHeader = () => {
  const { articleId } = useSelector((state: RootState) => state.ariclePage);
  const articles = useSelector((state: RootState) => state.articles);
  const articleSentenceIds = useSelector(
    (state: RootState) => state.articleSentenceIds
  );
  const { fetchedAudioBuffers } = useSelector(
    (state: RootState) => state.audio
  );
  const sentences = useSelector((state: RootState) => state.sentences);

  const article = useMemo(() => articles[articleId], [articleId, articles]);
  const sentenceIds = useMemo(
    () => articleSentenceIds[articleId],
    [articleId, articleSentenceIds]
  );
  const audioBuffer = useMemo(() => {
    const path = ARTILCE_STORAGE_PATH + articleId;
    return fetchedAudioBuffers[path] || null;
  }, [articleId, fetchedAudioBuffers]);
  const { start, end } = useMemo(() => {
    try {
      return {
        start: sentences[sentenceIds[0]].start,
        end: sentences[sentenceIds.slice(-1)[0]].end,
      };
    } catch (e) {
      return { start: 0, end: 0 };
    }
  }, [sentences, sentenceIds]);

  if (!article) return <></>;

  return (
    <div style={{ display: 'grid', rowGap: 8 }}>
      <Title />
      <CreatedAt />
      {!!audioBuffer && article.isShowAccents && (
        <>
          <AudioBufferSlider
            end={end}
            audioBuffer={audioBuffer}
            start={start}
          />
          <Divider />
        </>
      )}
    </div>
  );
};

export default ArticleHeader;
