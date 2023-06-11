import { useTheme } from '@mui/material';
import { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../../../../../..';
import BlobSlider from '../../../../../../components/BlobSlider';

import RemoveAudioButton from './RemoveAudioButton';

const AssignmentAudioPlayer = ({
  sentenceIndex,
}: {
  sentenceIndex: number;
}) => {
  const { articleId } = useParams();
  if (!articleId) return <></>;
  const { state } = useContext(AppContext);
  const theme = useTheme();
  const { articlePages } = state;
  const articlePage = articlePages[articleId];
  const { assignmentBlobs, sentences } = articlePage;

  const sentence = sentences[sentenceIndex];
  const { storageDuration, id } = sentence;
  const blob = assignmentBlobs[id];
  return (
    <div
      style={{
        display: 'grid',
        columnGap: 8,
        gridTemplateColumns: '1fr 32px',
      }}
    >
      <div
        style={{
          border: '1px solid #A9D1D5',
          padding: 8,
          borderRadius: 8,
        }}
      >
        <div
          style={{
            ...(theme.typography as any).mPlusRounded,
            color: '#52a2aa',
            fontSize: 12,
            marginBottom: 8,
          }}
        >
          練習:
        </div>

        <div
          style={{
            display: 'grid',
            position: 'relative',
            marginLeft: -8,
            marginTop: -16,
          }}
        >
          {blob && (
            <BlobSlider duration={storageDuration} spacer={5} blob={blob} />
          )}
        </div>
      </div>
      <RemoveAudioButton sentenceIndex={sentenceIndex} />
    </div>
  );
};

export default AssignmentAudioPlayer;
