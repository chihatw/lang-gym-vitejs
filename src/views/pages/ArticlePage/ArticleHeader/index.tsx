import { Divider } from '@mui/material';

import Title from './Title';
import CreatedAt from './CreatedAt';
import AudioBufferSlider from 'views/components/AudioBufferSlider';

import { useSelector } from 'react-redux';
import { RootState } from 'main';
import {
  selectArticle,
  selectAudioBuffer,
  selectArticleBufferStartAndEnd,
} from 'application/articlePage/framework/2-selector';

const ArticleHeader = () => {
  const article = useSelector((state: RootState) => selectArticle(state));

  const { start, end } = useSelector((state: RootState) =>
    selectArticleBufferStartAndEnd(state)
  );

  const audioBuffer = useSelector((state: RootState) =>
    selectAudioBuffer(state)
  );

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
