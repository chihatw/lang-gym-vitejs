import { useMemo } from 'react';
import { Divider } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { RootState } from 'main';

import Title from './Title';
import CreatedAt from './CreatedAt';
import AudioBufferSlider from 'views/components/AudioBufferSlider';
import { ARTILCE_STORAGE_PATH } from 'application/audio/core/1-constants';

const ArticleHeader = () => {
  const { articleId } = useParams();
  const articles = useSelector((state: RootState) => state.articles);
  const articleSentenceIds = useSelector(
    (state: RootState) => state.articleSentenceIds
  );
  const sentences = useSelector((state: RootState) => state.sentences);
  const { fetchedAudioBuffers } = useSelector(
    (state: RootState) => state.audio
  );

  const { article, audioBuffer } = useMemo(() => {
    const article = articles[articleId!] || null;
    const path = ARTILCE_STORAGE_PATH + articleId;
    const audioBuffer = fetchedAudioBuffers[path] || null;
    return { article, audioBuffer };
  }, [articleId, articles, fetchedAudioBuffers]);

  const { start, end } = useMemo(() => {
    const sentenceIds = articleSentenceIds[articleId!];
    try {
      return {
        start: sentences[sentenceIds[0]].start,
        end: sentences[sentenceIds.slice(-1)[0]].end,
      };
    } catch (e) {
      return { start: 0, end: 0 };
    }
  }, [articleId, articleSentenceIds, sentences]);

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
