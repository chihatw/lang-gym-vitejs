import { Divider } from '@mui/material';
import React, { useContext, useMemo } from 'react';

import CreatedAt from './CreatedAt';
import Title from './Title';
import AudioSlider from '../../../../components/AudioSlider';
import { AppContext } from '../../../../App';

const ArticleHeader = () => {
  const { state } = useContext(AppContext);
  const { articlePage, audioContext } = state;
  const { sentences, articleBlob } = articlePage;

  const end = useMemo(() => sentences.slice(-1)[0]?.end || 0, [sentences]);
  const start = useMemo(() => sentences[0]?.start || 0, [sentences]);

  return (
    <div style={{ display: 'grid', rowGap: 8 }}>
      <Title state={state} />
      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr' }}>
        <CreatedAt state={state} />
      </div>
      {!!audioContext && !!articleBlob && articleBlob.size > 2000 && (
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
