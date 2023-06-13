import { useMemo } from 'react';
import { Divider } from '@mui/material';

import Title from './Title';
import CreatedAt from './CreatedAt';
import AudioBufferSlider from 'views/components/AudioBufferSlider';
import { IArticle } from 'application/articles/core/0-interface';
import { ISentence } from 'application/sentences/core/0-interface';

const ArticleHeader = ({
  article,
  sentences,
  audioBuffer,
  sentenceIds,
}: {
  article: IArticle;
  sentences: { [id: string]: ISentence };
  sentenceIds: string[];
  audioBuffer: AudioBuffer | null;
}) => {
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
