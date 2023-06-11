import {
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage';
import {
  INITIAL_RANDOM_WORKOUT,
  RandomWorkout,
  RandomWorkoutState,
  State,
} from '../../Model';
import { db, storage } from '../../infrastructure/firebase';

const COLLECTIONS = {
  randomWorkouts: 'randomWorkouts',
};

export const IMAGE_PATHS = [
  '/images/red.png',
  '/images/blue.png',
  '/images/yellow.png',
  '/images/green.png',
  '/images/pink.png',
  '/images/orange.png',
  '/images/motsu.png',
  '/images/yubisasu.png',
  '/images/hikkurikaesu.png',
  '/images/ireru.png',
  '/images/kabuseru.png',
  '/images/noseru.png',
];

export const getRandomWorkout = async (id: string) => {
  console.log('get workout');
  const snapshot = await getDoc(doc(db, COLLECTIONS.randomWorkouts, id));
  if (!snapshot.exists()) {
    return INITIAL_RANDOM_WORKOUT;
  }
  const workout = buildRandomWorkout(snapshot);
  return workout;
};

export const getRandomWorkouts = async (uid: string) => {
  const randomWorkouts: { [key: string]: RandomWorkout } = {};
  let q = query(
    collection(db, COLLECTIONS.randomWorkouts),
    where('uid', '==', uid),
    orderBy('createdAt')
  );
  console.log('get randomWorkouts');
  let querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    randomWorkouts[doc.id] = buildRandomWorkout(doc);
  });
  return randomWorkouts;
};

export const setRandomWorkout = async (workout: RandomWorkout) => {
  const { id, ...omitted } = workout;
  console.log('set randomWorkout');
  await setDoc(doc(db, COLLECTIONS.randomWorkouts, id), { ...omitted });
};

const buildRandomWorkout = (doc: DocumentData) => {
  const {
    uid,
    cues,
    title,
    cueIds,
    beatCount,
    resultBpm,
    targetBpm,
    roundCount,
    createdAt,
    storagePath,
    recordCount,
    resultSeconds,
  } = doc.data();
  const randomWorkout: RandomWorkout = {
    id: doc.id,
    uid: uid || '',
    cues: cues || [],
    title: title || '',
    cueIds: cueIds || [],
    targetBpm: targetBpm || 0,
    resultBpm: resultBpm || 0,
    createdAt: createdAt || 0,
    beatCount: beatCount || 0,
    roundCount: roundCount || 0,
    storagePath: storagePath || '',
    recordCount: recordCount || 0,
    resultSeconds: resultSeconds || 0,
  };
  return randomWorkout;
};

export const calcBpm = (
  miliSeconds: number,
  beatCount: number,
  roundCount: number,
  cueCount: number
) => {
  if (!miliSeconds) return 0;
  const totalBeatCount = roundCount * beatCount;
  const seconds =
    Math.floor(miliSeconds / 1000) +
    Math.floor((miliSeconds % 1000) / 100) / 10;

  const readTime = cueCount * 0.5; // 1問を 0.5秒で把握する

  const bps = totalBeatCount / (seconds > readTime ? seconds - readTime : 0.1);

  const bpm = Math.round(bps * 60);
  return bpm;
};

export const miliSecondsToSeconds = (miliSeconds: number) => {
  const seconds =
    Math.floor(miliSeconds / 1000) +
    Math.floor((miliSeconds % 1000) / 100) / 10;
  return seconds;
};

export const buildWorkoutState = async (
  state: State,
  uid: string
): Promise<RandomWorkoutState> => {
  const _workouts = Object.keys(state.workout.workouts).length
    ? state.workout.workouts
    : await getRandomWorkouts(uid);
  const storagePathToFetch: { workoutId: string; storagePath: string }[] = [];
  for (const workout of Object.values(_workouts)) {
    const { id: workoutId, storagePath } = workout;
    if (
      !!storagePath &&
      !Object.keys(state.workout.blobs).includes(workoutId)
    ) {
      storagePathToFetch.push({ workoutId, storagePath });
    }
  }
  const gotBlobs: { [workoutId: string]: Blob | null } = {};
  await Promise.all(
    storagePathToFetch.map(async ({ workoutId, storagePath }) => {
      console.log('get workout audio');
      const downloadURL = await getDownloadURL(ref(storage, storagePath));
      const response = await fetch(downloadURL);
      const blob = await response.blob();
      gotBlobs[workoutId] = blob;
    })
  );

  return {
    workouts: _workouts,
    blobs: { ...state.workout.blobs, ...gotBlobs },
  };
};
