import { Divider } from '@mui/material';

import Title from './Title';
import CreatedAt from './CreatedAt';
import AudioBufferSlider from 'views/components/AudioBufferSlider';

import { useSelector } from 'react-redux';
import { RootState } from 'main';
import { ARTILCE_STORAGE_PATH } from 'application/audio/core/1-constants';
import { getSentenceIds } from 'application/sentences/core/2-services';

const ArticleHeader = () => {
  const { articleId } = useSelector((state: RootState) => state.ariclePage);
  const article = useSelector(
    (state: RootState) => state.articles[articleId] || null
  );

  const sentenceIds = useSelector((state: RootState) =>
    getSentenceIds(articleId, state.sentences)
  );

  const { start, end } = useSelector((state: RootState) => {
    try {
      return {
        start: state.sentences[sentenceIds[0]].start,
        end: state.sentences[sentenceIds.slice(-1)[0]].end,
      };
    } catch (e) {
      return { start: 0, end: 0 };
    }
  });

  const audioBuffer = useSelector((state: RootState) => {
    const { fetchedAudioBuffers } = state.audio;
    const path = ARTILCE_STORAGE_PATH + articleId;
    return fetchedAudioBuffers[path] || null;
  });

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
