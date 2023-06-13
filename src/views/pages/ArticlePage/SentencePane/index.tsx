import { Divider } from '@mui/material';
import Index from './StyledIndex';
import PitchesPane from './PitchesPane';
import { ISentence } from 'application/sentences/core/0-interface';
import { IArticle } from 'application/articles/core/0-interface';
import Japanese from './Japanese';
import Chinese from './Chinese';
import Original from './Original';

const SentencePane = ({
  article,
  sentence,
  audioBuffer,
}: {
  article: IArticle;
  sentence: ISentence;
  audioBuffer: AudioBuffer | null;
}) => {
  if (!article || !sentence) return <></>;

  return (
    <div
      id={sentence.id}
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
        <PitchesPane sentence={sentence} audioBuffer={audioBuffer} />
      )}
      <Divider />
    </div>
  );
};

export default SentencePane;
