import { Divider } from '@mui/material';
import React, { useContext, useMemo } from 'react';

import CreatedAt from './CreatedAt';
import Title from './Title';
import AudioSlider from '../../../../components/AudioSlider';
import { AppContext } from '../../../../../App';
import { useParams } from 'react-router-dom';

const ArticleHeader = () => {
  const { articleId } = useParams();
  if (!articleId) return <></>;

  const { state } = useContext(AppContext);
  const { articlePages } = state;
  const articlePage = articlePages[articleId];
  const { sentences, articleBlob } = articlePage;

  const end = useMemo(() => sentences.slice(-1)[0]?.end || 0, [sentences]);
  const start = useMemo(() => sentences[0]?.start || 0, [sentences]);

  return (
    <div style={{ display: 'grid', rowGap: 8 }}>
      <Title state={state} />
      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr' }}>
        <CreatedAt state={state} />
      </div>
      {!!articleBlob && articleBlob.size > 2000 && (
        <>
          <AudioSlider end={end} blob={articleBlob} start={start} spacer={5} />
          <Divider />
        </>
      )}
    </div>
  );
};

export default ArticleHeader;
