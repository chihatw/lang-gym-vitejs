import * as R from 'ramda';
import { Container, useTheme } from '@mui/material';

import {
  Dispatch,
  MutableRefObject,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../../../App';
import { shuffle } from '../../../services/utils';
import Header from './Header';
import {
  State,
  RandomWorkout,
  RandomWorkoutCue,
  RandomWorkoutState,
  INITIAL_RANDOM_WORKOUT,
} from '../../../Model';
import { Action, ActionTypes } from '../../../Update';
import {
  calcBpm,
  getRandomWorkout,
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
import { uploadStorage } from '../../../repositories/storage';
import { INITIAL_WORKOUT_FORM_STATE, WorkoutFormState } from './Model';

const reducer = (state: WorkoutFormState, action: WorkoutFormState) => action;

const WorkoutPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { workoutId } = useParams();
  const { state, dispatch } = useContext(AppContext);

  const [formState, formDispatch] = useReducer(
    reducer,
    INITIAL_WORKOUT_FORM_STATE
  );
  const [blob, setBlob] = useState<Blob | null>(null); // mediaRecorder のコールバックに使うので、独立させる
  const [workout, setWorkout] = useState(INITIAL_RANDOM_WORKOUT);
  const [miliSeconds, setMiliSeconds] = useState(0); // requestAnimationFrame のコールバックに使うので、独立させる
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const loopIdRef = useRef(0);
  const startAtRef = useRef(0);

  // streamと連携してマイクを切るため
  const micAudioElemRef = useRef(new Audio());
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  /** workout の代入 */
  useEffect(() => {
    if (!workoutId) return;

    const workout = state.workout.workouts[workoutId];
    if (!workout || !workout.id) {
      setWorkout(INITIAL_RANDOM_WORKOUT);
      return;
    }
    setWorkout(workout);
  }, [state.workout.workouts, workout]);

  /** state.workout.workouts の更新 */
  useEffect(() => {
    if (!workoutId) return;
    const workout = state.workout.workouts[workoutId];

    if (!!workout) return;
    const fetchData = async () => {
      updateState_by_fetch_Workout(workoutId, state, dispatch);
    };
    fetchData();
  }, [workoutId, state.workout.workouts]);

  /** imagesloaded の代入*/
  useEffect(() => {
    const imagesLoaded = checkImagesLoaded(state.blobURLs);
    setImagesLoaded(imagesLoaded);
  }, [state.blobURLs]);

  /** state.blobURLs の更新 */
  useEffect(() => {
    const imagesLoaded = checkImagesLoaded(state.blobURLs);
    if (imagesLoaded) return;
    const fetchData = async () => {
      updateState_by_fetch_ImagePaths(IMAGE_PATHS, state, dispatch);
    };
    fetchData();
  }, [state.blobURLs]);

  const start = async () => {
    // localhost の場合、 ios chrome では navigator が取得できない
    if (!workoutId || !navigator.mediaDevices || !state.audioContext) return;

    startRecording(micAudioElemRef, mediaRecorderRef, setBlob);
    startAnimation();

    const updatedWorkout = buildWorkout_by_createCueIds(workout);

    // local
    const updatedFormState: WorkoutFormState = {
      ...formState,
      isRunning: true,
    };
    formDispatch(updatedFormState);

    // app
    const updatedState = R.assocPath<RandomWorkout, State>(
      ['workout', 'workouts', updatedWorkout.id],
      updatedWorkout
    )(state);

    dispatch({
      type: ActionTypes.setState,
      payload: updatedState,
    });

    // remote
    await setRandomWorkout(updatedWorkout);
  };

  const startAnimation = () => {
    startAtRef.current = performance.now();
    loopIdRef.current = window.requestAnimationFrame(loopAnimation);
  };

  const loopAnimation = () => {
    const elapsedTime = Math.floor(performance.now() - startAtRef.current);

    setMiliSeconds(elapsedTime);
    loopIdRef.current = window.requestAnimationFrame(loopAnimation);
  };

  const stopAnimation = () => {
    window.cancelAnimationFrame(loopIdRef.current);
  };

  const next = () => {
    const updatedFormState: WorkoutFormState = {
      ...formState,
      currentIndex: formState.currentIndex + 1,
    };
    formDispatch(updatedFormState);
  };

  const stop = async () => {
    if (!workoutId) return;

    stopAnimation();

    const elapsedTime = Math.floor(performance.now() - startAtRef.current);

    // 録音ストップは 500ms後
    setTimeout(() => {
      stopRecording(micAudioElemRef, mediaRecorderRef);
    }, 500);

    // local
    const updatedFormState: WorkoutFormState = {
      ...formState,
      isRunning: true,
      isChecking: true,
      // currentIndex: 0, ここで変更すると、画面遷移前に index 0 の curCard が見えてしまう
    };
    setMiliSeconds(elapsedTime);
    formDispatch(updatedFormState);

    // app
    updateState_by_elapsedTime(workout, elapsedTime, state, dispatch);
  };

  const handleClickReset = () => {
    stopAnimation();
    stopRecording(micAudioElemRef, mediaRecorderRef);

    // local
    const updatedFormState: WorkoutFormState = {
      isRunning: false,
      isChecking: false,
      currentIndex: 0,
    };
    setMiliSeconds(0);
    formDispatch(updatedFormState);
  };

  const handleClickPlayButton = () => {
    if (!formState.isRunning) {
      start();
      return;
    }
    if (formState.currentIndex !== workout.cueIds.length - 1) {
      next();
      return;
    }
    stop();
  };

  const abandonRecordedBlob = () => {
    // local
    const updatedFormState: WorkoutFormState = {
      isRunning: false,
      isChecking: false,
      currentIndex: 0,
    };
    setBlob(null);
    setMiliSeconds(0);
    formDispatch(updatedFormState);
  };

  const saveRecordedBlob = async () => {
    if (!blob) return;
    // workoutId １つに対して、１つの stroragePath しかないので、上書きになる
    const storagePath = `/randomWorkout/${workout.id}`;

    // storage
    await uploadStorage(blob, storagePath);

    // local
    const updatedFormState: WorkoutFormState = {
      isRunning: false,
      isChecking: false,
      currentIndex: 0,
    };
    setBlob(null);
    setMiliSeconds(0);
    formDispatch(updatedFormState);
    const updatedWorkout: RandomWorkout = {
      ...workout,
      storagePath,
    };
    // remote
    await setRandomWorkout(updatedWorkout);

    navigate('/workout/list');

    // app
    // リストへ遷移してから、変更
    setTimeout(() => {
      updateState_by_recordedBlob(updatedWorkout, blob, state, dispatch);
    }, 200);
  };

  if (!imagesLoaded) return <></>;

  if (!state.auth.uid || !workoutId) return <Navigate to='/login' />;

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
            workout.cueIds.length ? formState.currentIndex + 1 : 0
          }/${workout.cueIds.length}`}</div>
          <TimeDisplay miliSeconds={miliSeconds} />
          <div style={{ height: 320 }}>
            {formState.isRunning && (
              <CueCard
                currentIndex={formState.currentIndex}
                workout={workout}
              />
            )}
          </div>
          <PlayButton
            hasNext={formState.currentIndex !== workout.cueIds.length - 1}
            isRunning={formState.isRunning}
            handleClickPlayButton={handleClickPlayButton}
          />
          <div style={{ height: 24 }} />
          <ResetButton reset={handleClickReset} />
          {!!blob && !!state.audioContext && (
            <CheckPane
              blob={blob}
              workout={workout}
              formState={formState}
              miliSeconds={miliSeconds}
              audioContext={state.audioContext}
              saveRecordedBlob={saveRecordedBlob}
              abandonRecordedBlob={abandonRecordedBlob}
            />
          )}
        </div>
      </div>
    </Container>
  );
};

export default WorkoutPage;

const checkImagesLoaded = (blobURLs: { [imagePath: string]: string }) => {
  let imagesLoaded = true;
  for (const imagePath of IMAGE_PATHS) {
    if (!Object.keys(blobURLs).includes(imagePath)) {
      imagesLoaded = false;
    }
  }
  return imagesLoaded;
};

const updateState_by_fetch_Workout = async (
  workoutId: string,
  state: State,
  dispatch: (value: Action) => void
) => {
  const workout = await getRandomWorkout(workoutId);
  if (!workout.id) return;
  const updatedState = R.assocPath<RandomWorkout, State>(
    ['workout', 'workouts', workout.id],
    workout
  )(state);
  dispatch({ type: ActionTypes.setState, payload: updatedState });
};

const updateState_by_fetch_ImagePaths = async (
  imagePaths: string[],
  state: State,
  dispatch: (value: Action) => void
) => {
  const blobURLs: { [imagePath: string]: string } = {};
  await Promise.all(
    imagePaths.map(async (imagePath) => {
      console.log('get imageBlob');
      const downloadURL = await getDownloadURL(ref(storage, imagePath));
      const response = await fetch(downloadURL);
      const blob = await response.blob();
      const blobURL = window.URL.createObjectURL(blob);
      blobURLs[imagePath] = blobURL;
    })
  );
  const updatedState: State = {
    ...state,
    blobURLs: { ...state.blobURLs, ...blobURLs },
  };
  dispatch({ type: ActionTypes.setState, payload: updatedState });
};

const startRecording = async (
  micAudioElemRef: MutableRefObject<HTMLAudioElement>,
  mediaRecorderRef: MutableRefObject<MediaRecorder | null>,
  setBlob: (value: Blob | null) => void
) => {
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

const buildCueIds = (cues: RandomWorkoutCue[], roundCount: number) => {
  let newCueIds: string[] = [];
  const cueIds = cues.map(({ id }) => id);
  for (let i = 0; i < roundCount; i++) {
    newCueIds = newCueIds.concat(shuffle(cueIds));
  }
  return newCueIds;
};

const buildWorkout_by_createCueIds = (workout: RandomWorkout) => {
  // 新しくシャッフルした cueIds を作成
  const cueIds = buildCueIds(workout.cues, workout.roundCount);

  const updatedWorkout: RandomWorkout = {
    ...workout,
    cueIds,
    recordCount: workout.recordCount + 1,
  };
  return updatedWorkout;
};

const stopRecording = (
  micAudioElemRef: MutableRefObject<HTMLAudioElement>,
  mediaRecorderRef: MutableRefObject<MediaRecorder | null>
) => {
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

const updateState_by_elapsedTime = (
  workout: RandomWorkout,
  elapsedTime: number,
  state: State,
  dispatch: Dispatch<Action>
) => {
  const bpm = calcBpm(
    elapsedTime,
    workout.beatCount,
    workout.roundCount,
    workout.cueIds.length
  );
  const seconds = miliSecondsToSeconds(elapsedTime);

  const updatedWorkout: RandomWorkout = {
    ...workout,
    resultBpm: bpm,
    resultSeconds: seconds,
  };

  const updatedState = R.assocPath<RandomWorkout, State>(
    ['workout', 'workouts', workout.id],
    updatedWorkout
  )(state);

  dispatch({
    type: ActionTypes.setState,
    payload: updatedState,
  });
};

const updateState_by_recordedBlob = (
  updatedWorkout: RandomWorkout,
  blob: Blob,
  state: State,
  dispatch: Dispatch<Action>
) => {
  const updatedWorkoutState: RandomWorkoutState = R.compose(
    R.assocPath<RandomWorkout, RandomWorkoutState>(
      ['workouts', updatedWorkout.id],
      updatedWorkout
    ),
    R.assocPath<Blob, RandomWorkoutState>(['blobs', updatedWorkout.id], blob)
  )(state.workout);
  const updatedState = R.assocPath<RandomWorkoutState, State>(
    ['workout'],
    updatedWorkoutState
  )(state);

  dispatch({
    type: ActionTypes.setState,
    payload: updatedState,
  });
};
