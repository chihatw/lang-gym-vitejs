import { Divider } from '@mui/material';
import React, { useMemo } from 'react';

import CreatedAt from './CreatedAt';
import Title from './Title';
import LinkButton from './LinkButton';
import AudioSlider from '../../../components/AudioSlider';
import { State } from '../../../Model';

const ArticleHeader = ({ state }: { state: State }) => {
  const { articlePage, audioContext } = state;
  const { article, sentences, articleBlob } = articlePage;
  const { isShowParse } = article;

  const end = useMemo(() => sentences.slice(-1)[0]?.end || 0, [sentences]);
  const start = useMemo(() => sentences[0]?.start || 0, [sentences]);

  return (
    <div style={{ display: 'grid', rowGap: 8 }}>
      <Title state={state} />
      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr' }}>
        <CreatedAt state={state} />
        {!!isShowParse && (
          <div style={{ textAlign: 'right' }}>
            <LinkButton state={state} />
          </div>
        )}
      </div>
      {!!audioContext && !!articleBlob && (
        <>
          <AudioSlider
            end={end}
            blob={articleBlob}
            start={start}
            spacer={5}
            audioContext={audioContext}
          />
          <Divider />
        </>
      )}
    </div>
  );
};

export default ArticleHeader;
