import {
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
} from 'firebase/firestore';

import { RANDOM_WORKOUT_STORE_COLLECTION } from '../core/1-constants';
import { db } from 'infrastructure/firebase';
import { IRandomWorkout } from '../core/0-interface';

export const fetchRandomWorkout = async (workoutId: string) => {
  console.log(`%cfetch ${RANDOM_WORKOUT_STORE_COLLECTION}`, 'color:red');

  const docSnapshot = await getDoc(
    doc(db, RANDOM_WORKOUT_STORE_COLLECTION, workoutId)
  );

  if (!docSnapshot.exists()) {
    return;
  }

  const randomWorkout = buildRandomWorkout(docSnapshot);
  return randomWorkout;
};

export const fetchRandomWorkouts = async (uid: string) => {
  console.log(`%cfetch ${RANDOM_WORKOUT_STORE_COLLECTION}`, 'color:red');

  const q = query(
    collection(db, RANDOM_WORKOUT_STORE_COLLECTION),
    where('uid', '==', uid)
  );

  const querySnapshot = await getDocs(q);
  const randomWorkouts: { [key: string]: IRandomWorkout } = {};
  querySnapshot.forEach((doc) => {
    randomWorkouts[doc.id] = buildRandomWorkout(doc);
  });

  return randomWorkouts;
};

export const clearStoragePath = async (workoutId: string) => {
  await updateDoc(doc(db, RANDOM_WORKOUT_STORE_COLLECTION, workoutId), {
    storagePath: '',
    resultBpm: 0,
    resultSeconds: 0,
  });
};

export const startRecording = async (
  workoutId: string,
  cueIds: string[],
  recordCount: number
) => {
  await updateDoc(doc(db, RANDOM_WORKOUT_STORE_COLLECTION, workoutId), {
    cueIds,
    recordCount,
  });
};

export const saveRecordedAudioBuffer = async ({
  workoutId,
  storagePath,
  recordCount,
  resultBpm,
  resultSeconds,
}: {
  workoutId: string;
  storagePath: string;
  recordCount: number;
  resultBpm: number;
  resultSeconds: number;
}) => {
  await updateDoc(doc(db, RANDOM_WORKOUT_STORE_COLLECTION, workoutId), {
    resultBpm,
    storagePath,
    recordCount,
    resultSeconds,
  });
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
  const randomWorkout: IRandomWorkout = {
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
