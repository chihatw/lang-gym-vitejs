import * as R from 'ramda';
import { Container, useTheme } from '@mui/material';

import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { AppContext } from '../../../App';
import { shuffle } from '../../../services/utils';
import Header from './Header';
import {
  RandomWorkout,
  RandomWorkoutParams,
  RandomWorkoutState,
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

import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../../../repositories/firebase';
import CueCard from './CueCard';
import CheckPane from './CheckPane';

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
    const updatedWorkout: RandomWorkout = {
      ...workout,
      cueIds: shuffledCueIds,
    };
    const updatedWorkoutState = R.compose(
      R.assocPath<RandomWorkoutParams, RandomWorkoutState>(['params'], {
        ...params,
        isRunning: true,
      }),
      R.assocPath<RandomWorkout, RandomWorkoutState>(
        ['workouts', workoutId],
        updatedWorkout
      )
    )(stateWorkout);

    dispatch({
      type: ActionTypes.setWorkout,
      payload: updatedWorkoutState,
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
    const updatedWorkoutState = R.compose(
      R.assocPath<RandomWorkoutParams, RandomWorkoutState>(['params'], {
        ...params,
        currentIndex: currentIndex + 1,
      })
    )(stateWorkout);

    dispatch({ type: ActionTypes.setWorkout, payload: updatedWorkoutState });
  };

  const stop = async () => {
    if (!dispatch) return;
    window.cancelAnimationFrame(loopIdRef.current);
    const elapsedTime = Math.floor(performance.now() - startAtRef.current);
    const bpm = calcBpm(elapsedTime, beatCount, roundCount, cueIds.length);
    const seconds = miliSecondsToSeconds(elapsedTime);

    const updatedWorkoutState = R.compose(
      R.assocPath<RandomWorkoutParams, RandomWorkoutState>(['params'], {
        ...params,
        isRunning: true,
        isChecking: true,
        miliSeconds: elapsedTime,
      }),
      R.assocPath<RandomWorkout, RandomWorkoutState>(['workouts', workoutId], {
        ...workout,
        resultBpm: bpm,
        resultSeconds: seconds,
      })
    )(stateWorkout);

    // ここはローカルだけ変更
    dispatch({
      type: ActionTypes.setWorkout,
      payload: updatedWorkoutState,
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

    const updatedWorkoutState: RandomWorkoutState = R.compose(
      R.assocPath<RandomWorkoutParams, RandomWorkoutState>(['params'], {
        ...params,
        isRunning: false,
        currentIndex: 0,
      })
    )(stateWorkout);

    dispatch({ type: ActionTypes.setWorkout, payload: updatedWorkoutState });
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
