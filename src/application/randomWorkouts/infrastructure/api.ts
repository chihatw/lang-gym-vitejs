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
  updateDoc,
} from 'firebase/firestore';

import { RANDOM_WORKOUT_STORE_COLLECTION } from '../core/1-constants';
import { db } from 'infrastructure/firebase';
import { IRandomWorkout } from '../core/0-interface';

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
