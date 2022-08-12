import { Button, Container, Modal, useTheme } from '@mui/material';

import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../../../App';
import { shuffle } from '../../../services/utils';
import Header from './Header';
import {
  INITIAL_CUE,
  INITIAL_RANDOM_WORKOUT,
  RandomWorkout,
  RandomWorkoutCue,
  RandomWorkoutParams,
  State,
} from '../../../Model';
import { ActionTypes } from '../../../Update';
import {
  calcBpm,
  IMAGE_PATHS,
  miliSecondsToSeconds,
  setRandomWorkout,
} from '../../../services/workout';
import TimeDisplay from './TimeDisplay';
import PlayButton from './PlayButton';
import ResetButton from './ResetButton';
import BlobSlider from '../../../components/BlobSlider';
import string2PitchesArray from 'string2pitches-array';
import { SentencePitchLine } from '@chihatw/lang-gym-h.ui.sentence-pitch-line';
import { uploadStorage } from '../../../repositories/storage';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../../../repositories/firebase';
import CueCard from './CueCard';

const WorkoutPage = () => {
  const theme = useTheme();
  const { workoutId } = useParams();
  const { state, dispatch } = useContext(AppContext);
  const { auth, workout: stateWorkout, audioContext, blobURLs } = state;
  const { uid } = auth;
  const { workouts, params } = stateWorkout;
  const { currentIndex, isRunning } = params;

  if (!uid || !workoutId) return <Navigate to='/login' />;

  const workout = workouts[workoutId];
  const { cues, roundCount, cueIds, beatCount } = workout;

  const [loaded, setLoaded] = useState(false);
  const [miliSeconds, setMiliSeconds] = useState(0);
  const [blob, setBlob] = useState<Blob | null>(null);

  const loopIdRef = useRef(0);
  const startAtRef = useRef(0);

  useEffect(() => {
    if (!dispatch) return;
    let loaded = true;
    for (const imagePath of IMAGE_PATHS) {
      if (!Object.keys(blobURLs).includes(imagePath)) {
        loaded = false;
      }
    }
    setLoaded(loaded);
    if (loaded) return;
    const fetchData = async () => {
      const _blobURLs: { [imagePath: string]: string } = {};
      await Promise.all(
        IMAGE_PATHS.map(async (imagePath) => {
          console.log('get imageBlob');
          const downloadURL = await getDownloadURL(ref(storage, imagePath));
          const response = await fetch(downloadURL);
          const blob = await response.blob();
          const blobURL = window.URL.createObjectURL(blob);
          _blobURLs[imagePath] = blobURL;
        })
      );
      const updatedState: State = {
        ...state,
        blobURLs: { ...blobURLs, ..._blobURLs },
      };
      dispatch({ type: ActionTypes.setState, payload: updatedState });
    };
    fetchData();
  }, [blobURLs]);

  // streamと連携してマイクを切るため
  const micAudioElemRef = useRef(new Audio());
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const start = async () => {
    // localhost の場合、 ios chrome では navigator が取得できない
    if (!navigator.mediaDevices || !audioContext || !dispatch) return;
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

    // 新しくシャッフルした cueIds を作成
    let shuffledCueIds: string[] = [];
    const cueIds = cues.map(({ id }) => id);
    for (let i = 0; i < roundCount; i++) {
      shuffledCueIds = shuffledCueIds.concat(shuffle(cueIds));
    }

    const updatedParams: RandomWorkoutParams = {
      ...params,
      isRunning: true,
    };
    const updatedWorkout: RandomWorkout = {
      ...workout,
      cueIds: shuffledCueIds,
    };
    dispatch({
      type: ActionTypes.startWorkout,
      payload: { params: updatedParams, workout: updatedWorkout },
    });
    // remote
    await setRandomWorkout(updatedWorkout);
    startAtRef.current = performance.now();
    loopIdRef.current = window.requestAnimationFrame(loop);
  };

  const loop = () => {
    const elapsedTime = Math.floor(performance.now() - startAtRef.current);
    setMiliSeconds(elapsedTime);
    loopIdRef.current = window.requestAnimationFrame(loop);
  };

  const next = () => {
    if (!dispatch) return;
    const updated: RandomWorkoutParams = {
      ...params,
      currentIndex: currentIndex + 1,
    };
    dispatch({ type: ActionTypes.setWorkoutParams, payload: updated });
  };

  const stop = async () => {
    if (!dispatch) return;
    window.cancelAnimationFrame(loopIdRef.current);
    const elapsedTime = Math.floor(performance.now() - startAtRef.current);
    const bpm = calcBpm(elapsedTime, beatCount, roundCount);
    const seconds = miliSecondsToSeconds(elapsedTime);
    const updatedWorkout: RandomWorkout = {
      ...workout,
      resultBpm: bpm,
      resultSeconds: seconds,
    };
    const updatedParams: RandomWorkoutParams = {
      ...params,
      isRunning: true,
      isChecking: true,
      miliSeconds: elapsedTime,
    };
    // ここはローカルだけ変更
    dispatch({
      type: ActionTypes.stopWorkout,
      payload: { params: updatedParams, workout: updatedWorkout },
    });
    setMiliSeconds(0);

    // 実際に録音ストップは 500ms後
    setTimeout(() => {
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
    }, 500);
  };

  const reset = () => {
    if (!dispatch) return;
    window.cancelAnimationFrame(loopIdRef.current);
    const updated: RandomWorkoutParams = {
      ...params,
      isRunning: false,
      currentIndex: 0,
    };
    dispatch({ type: ActionTypes.setWorkoutParams, payload: updated });
    setMiliSeconds(0);

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
  };

  const clearBlob = useCallback(() => {
    setBlob(null);
  }, []);
  if (!loaded) return <></>;
  return (
    <Container maxWidth='sm'>
      <div style={{ height: 48 }} />
      <div style={{ paddingTop: 16, paddingBottom: 80 }}>
        <div
          style={{
            ...(theme.typography as any).notoSerifJP,
            display: 'grid',
          }}
        >
          <Header />
          <div style={{ fontSize: 48, textAlign: 'center' }}>{`${
            cueIds.length ? currentIndex + 1 : 0
          }/${cueIds.length}`}</div>
          <TimeDisplay miliSeconds={miliSeconds} />
          <div style={{ height: 320 }}>{isRunning && <CueCard />}</div>
          <PlayButton
            start={start}
            stop={stop}
            next={next}
            isRunning={isRunning}
            hasNext={currentIndex !== cueIds.length - 1}
          />
          <div style={{ height: 24 }} />
          <ResetButton reset={reset} />
          <CheckPane blob={blob} clearBlob={clearBlob} />
        </div>
      </div>
    </Container>
  );
};

export default WorkoutPage;

const CheckPane = React.memo(
  ({ blob, clearBlob }: { blob: Blob | null; clearBlob: () => void }) => {
    const navigate = useNavigate();
    const { workoutId } = useParams();
    const theme = useTheme();
    const { state, dispatch } = useContext(AppContext);
    const { workout: stateWorkout, audioContext } = state;
    const { params, workouts } = stateWorkout;

    if (!workoutId) return <></>;

    const workout = workouts[workoutId];
    const { cues, cueIds, resultBpm } = workout;
    const { isChecking, miliSeconds } = params;

    const storagePath = `/randomWorkout/${workoutId}`;

    const handleSave = async () => {
      if (!blob || !dispatch) return;
      await uploadStorage(blob, storagePath);
      const updatedWorkout: RandomWorkout = {
        ...workout,
        storagePath,
      };
      const updatedParams: RandomWorkoutParams = {
        miliSeconds: 0,
        isRunning: false,
        isChecking: false,
        currentIndex: 0,
      };

      await setRandomWorkout(updatedWorkout);
      navigate('/workout/list');

      // リストへ遷移してから、変更
      setTimeout(() => {
        dispatch({
          type: ActionTypes.saveWorkout,
          payload: { params: updatedParams, workout: updatedWorkout },
        });
      }, 200);
    };
    const handleCancel = () => {
      if (!dispatch) return;
      clearBlob();
      const updated: RandomWorkoutParams = {
        miliSeconds: 0,
        isRunning: false,
        isChecking: false,
        currentIndex: 0,
      };
      dispatch({ type: ActionTypes.setWorkoutParams, payload: updated });
    };

    return (
      <Modal open={isChecking}>
        <div
          style={{
            width: '100vw',
            minHeight: '100vh',
            background: '#fafafa',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Container maxWidth='sm'>
            <div style={{ display: 'grid', rowGap: 16 }}>
              <TimeDisplay miliSeconds={miliSeconds} />
              <div
                style={{
                  ...(theme.typography as any).mRounded300,
                  fontSize: 48,
                  marginTop: -32,
                  marginBottom: -16,
                  textAlign: 'center',
                }}
              >
                <span style={{ fontSize: 16 }}>BPM: </span>
                <span>{resultBpm}</span>
              </div>
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
              {!!blob && !!audioContext && (
                <BlobSlider
                  blob={blob}
                  spacer={5}
                  duration={miliSeconds / 1000 + 0.3}
                  audioContext={audioContext}
                />
              )}
              <div
                style={{
                  display: 'grid',
                  rowGap: 8,
                  height: 320,
                  overflowY: 'scroll',
                  background: 'white',
                  borderRadius: 8,
                }}
              >
                <div style={{ padding: '24px 0' }}>
                  {cueIds.map((cueId, index) => {
                    const cue =
                      cues.find((item) => item.id === cueId) || INITIAL_CUE;
                    const { pitchStr } = cue;
                    const pitchesArray = string2PitchesArray(pitchStr);
                    return (
                      <div
                        key={index}
                        style={{ display: 'flex', justifyContent: 'center' }}
                      >
                        <SentencePitchLine pitchesArray={pitchesArray} />
                      </div>
                    );
                  })}
                </div>
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
                <div style={{ height: 180 }} />
              </div>
            </div>
          </Container>
        </div>
      </Modal>
    );
  }
);
