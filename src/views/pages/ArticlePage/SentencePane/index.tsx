import { Divider } from '@mui/material';
import Index from './StyledIndex';
import PitchesPane from './PitchesPane';
import Japanese from './Japanese';
import Chinese from './Chinese';
import Original from './Original';
import { useSelector } from 'react-redux';
import { RootState } from 'main';
import { selectSentenceById } from 'application/sentences/framework/0-reducer';
import {
  selectArticle,
  selectAudioBuffer,
} from 'application/articlePage/framework/2-selector';

const SentencePane = ({ sentenceId }: { sentenceId: string }) => {
  const article = useSelector((state: RootState) => selectArticle(state));
  const sentence = useSelector((state: RootState) =>
    selectSentenceById(state, sentenceId)
  );
  const audioBuffer = useSelector((state: RootState) =>
    selectAudioBuffer(state)
  );

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
