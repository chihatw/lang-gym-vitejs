import StopCircleRoundedIcon from '@mui/icons-material/StopCircleRounded';
import PlayCircleRoundedIcon from '@mui/icons-material/PlayCircleRounded';
import { Button, Collapse, Container, IconButton, Modal } from '@mui/material';
import React, { useRef, useState } from 'react';

import Japanese from '../../../../TextLines/Japanese';
import SentencePitches from '../../../SentencePitches';

import {
  blobToAudioBuffer,
  createSourceNode,
} from '../../../../../../../services/utils';
import { State } from '../../../../../../../Model';
import { uploadStorage } from '../../../../../../../repositories/storage';
import { updateSentence } from '../../../../../../../services/article';
import { Action, ActionTypes } from '../../../../../../../Update';

const CheckPane = ({
  blob,
  state,
  sentenceIndex,
  isChecking,
  handleChecked,
  dispatch,
}: {
  blob: Blob;
  sentenceIndex: number;
  state: State;
  isChecking: boolean;
  handleChecked: () => void;
  dispatch: React.Dispatch<Action>;
}) => {
  const { articlePage, audioContext } = state;
  const { sentences, articleBlob } = articlePage;
  const sentence = sentences[sentenceIndex];
  const { japanese, id } = sentence;

  const storagePath = `assignments/${id}`;

  const [isPlaying, setIsPlaying] = useState(false);
  const [played, setPlayed] = useState(false);

  const sourseNodeRef = useRef<AudioBufferSourceNode | null>(null);

  const handleSave = async () => {
    handleChecked();
    setPlayed(false);
    if (!audioContext) return;
    uploadStorage(blob, storagePath);
    const audioBuffer = await blobToAudioBuffer(blob, audioContext);
    const storageDuration = audioBuffer.duration;
    const updatedSentence = { ...sentence, storageDuration, storagePath };
    dispatch({
      type: ActionTypes.setAssignmentBlob,
      payload: { sentence: updatedSentence, blob },
    });
    updateSentence(id, storagePath, storageDuration);
  };
  const handleCancel = () => {
    handleChecked();
    setPlayed(false);
  };

  const handlePlay = () => {
    isPlaying ? pause() : play();
    setPlayed(true);
  };

  const play = async () => {
    if (!audioContext) return;
    const sourceNode = await createSourceNode(blob, audioContext);
    sourceNode.onended = () => {
      setIsPlaying(false);
    };
    sourceNode.start(0);
    setIsPlaying(true);
    sourseNodeRef.current = sourceNode;
  };

  const pause = () => {
    const sourceNode = sourseNodeRef.current;
    sourceNode && sourceNode.stop(0);
    // AudioBufferSourceNodeは使い捨て
    sourseNodeRef.current = null;
    setIsPlaying(false);
  };

  return (
    <Modal open={isChecking} onClose={() => {}}>
      <div
        style={{
          width: '100vw',
          height: '100vh',
          background: 'white',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Container maxWidth='sm'>
          <div style={{ display: 'grid', rowGap: 32 }}>
            <div
              style={{
                color: '#52a2aa',
                textAlign: 'center',
                padding: '8px 0',
                userSelect: 'none',
              }}
            >
              録音をチェックしてください
            </div>
            <Japanese japanese={japanese} />
            {articleBlob && (
              <SentencePitches state={state} sentenceIndex={sentenceIndex} />
            )}

            <div style={{ textAlign: 'center' }}>
              <IconButton color='primary' onClick={handlePlay}>
                {isPlaying ? (
                  <StopCircleRoundedIcon sx={{ fontSize: 120 }} />
                ) : (
                  <PlayCircleRoundedIcon sx={{ fontSize: 120 }} />
                )}
              </IconButton>
            </div>
            <div style={{ height: 90 }}>
              <Collapse in={played}>
                <div style={{ display: 'grid', rowGap: 16 }}>
                  <Button
                    onClick={handleSave}
                    variant='contained'
                    color='primary'
                    sx={{ color: 'white' }}
                  >
                    きれいに読めました
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant='outlined'
                    color='primary'
                  >
                    もう一度録音します
                  </Button>
                </div>
              </Collapse>
            </div>
          </div>
        </Container>
      </div>
    </Modal>
  );
};

export default CheckPane;
