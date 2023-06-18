import { Divider } from '@mui/material';
import Index from './StyledIndex';
import PitchesPane from './PitchesPane';
import Japanese from './Japanese';
import Chinese from './Chinese';
import Original from './Original';
import { useSelector } from 'react-redux';
import { RootState } from 'main';
import { ARTILCE_STORAGE_PATH } from 'application/audio/core/1-constants';

const SentencePane = ({ sentenceId }: { sentenceId: string }) => {
  const { articleId } = useSelector((state: RootState) => state.ariclePage);
  const article = useSelector(
    (state: RootState) => state.articles.entities[articleId]
  );
  const sentence = useSelector(
    (state: RootState) => state.sentences[sentenceId]
  );
  const audioBuffer = useSelector((state: RootState) => {
    const { fetchedAudioBuffers } = state.audio;
    const path = ARTILCE_STORAGE_PATH + articleId;
    return fetchedAudioBuffers[path];
  });

  if (!article || !sentence) return <></>;

  return (
    <div
      id={sentenceId}
      style={{
        rowGap: 8,
        display: 'grid',
        marginTop: -48,
        paddingTop: 48,
        paddingBottom: 8,
      }}
    >
      <Index label={sentence.line + 1} />
      <Japanese japanese={sentence.japanese} />
      <Chinese chinese={sentence.chinese} />
      <Original original={sentence.original} />
      {article.isShowAccents && (
        <PitchesPane audioBuffer={audioBuffer} sentenceId={sentenceId} />
      )}
      <Divider />
    </div>
  );
};

export default SentencePane;
