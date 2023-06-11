import MicIcon from '@mui/icons-material/Mic';
import StopCircleRoundedIcon from '@mui/icons-material/StopCircleRounded';
import { IconButton } from '@mui/material';
import { useContext, useRef, useState } from 'react';
import { AppContext } from '../../../../../../..';
import CheckPane from './CheckPane';

const RecButton = ({ sentenceIndex }: { sentenceIndex: number }) => {
  const { state, dispatch } = useContext(AppContext);
  const [isRecording, setIsRecording] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [blob, setBlob] = useState<Blob | null>(null);

  // streamと連携してマイクを切るため
  const micAudioElemRef = useRef(new Audio());
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const handleClick = () => {
    if (isRecording) {
      stopRec();
    } else {
      startRec();
    }
    setIsRecording(!isRecording);
  };

  const startRec = async () => {
    // localhost の場合、 ios chrome では navigator が取得できない
    if (!navigator.mediaDevices) return;
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });

    const mediaRecorder = new MediaRecorder(stream);
    // データが入力された時の処理
    mediaRecorder.ondataavailable = async (event: BlobEvent) => {
      setBlob(event.data);
    };
    mediaRecorder.start();

    mediaRecorderRef.current = mediaRecorder;
    // AudioElementと stream を連携
    micAudioElemRef.current.srcObject = stream;
  };

  const stopRec = () => {
    let mediaRecorder = mediaRecorderRef.current;
    let audioElem = micAudioElemRef.current;
    if (!mediaRecorder) return;
    mediaRecorder.stop();
    const stream = audioElem.srcObject as MediaStream;
    stream.getTracks().forEach((track) => {
      track.stop();
    });
    // ブラウザのマイク使用中の表示を消すために必要
    audioElem.srcObject = null;
    mediaRecorder = null;
    setIsChecking(true);
  };

  const handleChecked = () => {
    setIsChecking(false);
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <IconButton color='primary' onClick={handleClick}>
        {isRecording ? (
          <StopCircleRoundedIcon sx={{ fontSize: 120 }} />
        ) : (
          <MicIcon sx={{ fontSize: 120 }} />
        )}
      </IconButton>
      {blob && (
        <CheckPane
          isChecking={isChecking}
          handleChecked={handleChecked}
          blob={blob}
          sentenceIndex={sentenceIndex}
        />
      )}
    </div>
  );
};

export default RecButton;
