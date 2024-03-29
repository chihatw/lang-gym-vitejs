import { Button, Collapse, Container, Modal } from '@mui/material';

import Japanese from '../SentencePane/Japanese';
import SentencePitches from '../SentencePane/PitchesPane/SentencePitches';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'main';

import PlayRecordedAudioButton from './PlayRecordedAudioButton';
import { articlePageActions } from 'application/articlePage/framework/0-reducer';
import { audioBuffersActions } from 'application/audioBuffers/framework/0-reducer';
import { selectRecordedSentence } from 'application/articlePage/framework/2-selector';
import { ASSIGNMENTS_STORAGE_PATH } from 'application/audioBuffers/infrastructure/api';

const CheckPane = ({
  audioBuffer,
}: {
  audioBuffer: AudioBuffer | undefined; // article audioBuffer
}) => {
  const dispatch = useDispatch();

  const { audioBuffer: recordedAudioBuffer, blob: recordedBlob } = useSelector(
    (state: RootState) => state.recordedAudio
  );
  const playedRecordedAudio = useSelector(
    (state: RootState) => state.ariclePage.playedRecordedAudio
  );

  const recordedSentence = useSelector((state: RootState) =>
    selectRecordedSentence(state)
  );

  if (!recordedSentence) return <></>;

  const abandonRecordedAudio = () => {
    dispatch(articlePageActions.resetRecordedAudio());
  };

  const saveRecordedAudio = async () => {
    if (!recordedBlob || !recordedAudioBuffer) return;

    // storage に　blob を upload
    // audioBuffers に audioBuffer をセット

    const path = ASSIGNMENTS_STORAGE_PATH + recordedSentence.id;
    dispatch(
      audioBuffersActions.saveAudioBuffer({
        id: path,
        audioBuffer: recordedAudioBuffer,
      })
    );
    dispatch(articlePageActions.resetRecordedAudio());
  };

  return (
    <Modal open={true}>
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
            <Japanese japanese={recordedSentence.japanese} />
            {audioBuffer && (
              <SentencePitches
                sentence={recordedSentence}
                audioBuffer={audioBuffer}
              />
            )}

            <div style={{ textAlign: 'center' }}>
              <PlayRecordedAudioButton />
            </div>
            <div style={{ height: 90 }}>
              <Collapse in={playedRecordedAudio}>
                <div style={{ display: 'grid', rowGap: 16 }}>
                  <Button
                    onClick={saveRecordedAudio}
                    variant='contained'
                    color='primary'
                    sx={{ color: 'white' }}
                  >
                    きれいに読めました
                  </Button>
                  <Button
                    onClick={abandonRecordedAudio}
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
