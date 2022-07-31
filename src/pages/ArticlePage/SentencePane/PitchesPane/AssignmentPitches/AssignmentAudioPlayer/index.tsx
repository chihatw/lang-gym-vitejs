import { BlobSlider } from '@chihatw/blob-slider.blob-slider';
import { useTheme } from '@mui/material';
import React from 'react';
import { State } from '../../../../../../Model';
import { Action } from '../../../../../../Update';

import RemoveAudioButton from './RemoveAudioButton';

const AssignmentAudioPlayer = ({
  state,
  sentenceIndex,
  dispatch,
}: {
  state: State;
  sentenceIndex: number;
  dispatch: React.Dispatch<Action>;
}) => {
  const theme = useTheme();
  const { articlePage, audioContext } = state;
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
          {audioContext && blob && (
            <BlobSlider
              duration={storageDuration}
              spacer={5}
              blob={blob}
              audioContext={audioContext}
            />
          )}
        </div>
      </div>
      <RemoveAudioButton
        sentenceIndex={sentenceIndex}
        dispatch={dispatch}
        state={state}
      />
    </div>
  );
};

export default AssignmentAudioPlayer;
