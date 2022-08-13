import {
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  startAfter,
  updateDoc,
  where,
} from 'firebase/firestore';
import { RandomWorkout } from '../Model';
import { db } from '../repositories/firebase';

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

export const getRandomWorkouts = async (uid: string) => {
  const randomWorkouts: { [key: string]: RandomWorkout } = {};
  let q = query(
    collection(db, COLLECTIONS.randomWorkouts),
    where('uid', '==', uid)
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
    resultSeconds,
    storagePath,
  } = doc.data();
  const randomWorkout: RandomWorkout = {
    id: doc.id,
    uid: uid || '',
    cues: cues || [],
    title: title || '',
    cueIds: cueIds || [],
    targetBpm: targetBpm || 0,
    resultBpm: resultBpm || 0,
    beatCount: beatCount || 0,
    roundCount: roundCount || 0,
    resultSeconds: resultSeconds || 0,
    storagePath: storagePath || '',
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
