import {
  collection,
  doc,
  DocumentData,
  getDocs,
  orderBy,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage';
import {
  INITIAL_WORKING_MEMORY,
  State,
  WorkingMemory,
  WorkingMemoryAnswer,
  WorkingMemoryAnswerLog,
} from '../Model';
import {
  WorkingMemoryFormState,
  INITIAL_WORKING_MEMORY_FORM_STATE,
} from '../pages/Workout/WorkingMemoryPage/Model';
import { db, storage } from '../repositories/firebase';
import { getRandomInt } from './utils';

const COLLECTIONS = {
  workingMemories: 'workingMemories',
};

export const getWorkingMemories = async (uid: string) => {
  const workingMemories: { [id: string]: WorkingMemory } = {};
  const q = query(
    collection(db, COLLECTIONS.workingMemories),
    where('uid', '==', uid),
    orderBy('createdAt')
  );
  console.log('get workingMemories');
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    workingMemories[doc.id] = buildWorkingMemory(doc);
  });
  return workingMemories;
};

const buildWorkingMemory = (doc: DocumentData): WorkingMemory => {
  const {
    uid,
    cues,
    title,
    offset,
    answers,
    cueCount,
    isActive,
    createdAt,
    storagePath,
  } = doc.data();
  return {
    id: doc.id,
    uid: uid || '',
    cues: cues || {},
    title: title || '',
    offset: offset || 0,
    answers: answers || {},
    cueCount: cueCount || 0,
    isActive: isActive || false,
    createdAt: createdAt || 0,
    storagePath: storagePath || '',
  };
};

export const getBlob = async (
  storagePath: string,
  blobs: { [downloadURL: string]: Blob }
): Promise<{ blob: Blob | null; downloadURL: string }> => {
  let blob: Blob | null = null;
  let downloadURL = '';
  if (storagePath) {
    console.log('get downloadURL');
    downloadURL = await getDownloadURL(ref(storage, storagePath));
  }
  if (downloadURL) {
    if (blobs[downloadURL]) {
      blob = blobs[downloadURL];
    } else {
      console.log('fetch blob');
      const response = await fetch(downloadURL);
      blob = await response.blob();
    }
  }
  return { blob, downloadURL };
};

export const setWorkingMemory = async (workingMemory: WorkingMemory) => {
  for (const key of Object.keys(workingMemory)) {
    if (!Object.keys(INITIAL_WORKING_MEMORY).includes(key)) {
      delete workingMemory[key as keyof WorkingMemory];
    }
  }
  const { id, ...omitted } = workingMemory;
  console.log('set workingMemory');
  setDoc(doc(db, COLLECTIONS.workingMemories, id), { ...omitted });
};

export const buildWorkingMemoryFormState = (
  state: State,
  blob: Blob | null,
  workoutId: string
): WorkingMemoryFormState => {
  const workingMemory = state.workingMemories[workoutId];
  if (!workingMemory) return INITIAL_WORKING_MEMORY_FORM_STATE;

  const cueIds: string[] = buildCueIds(
    Object.keys(workingMemory.cues),
    workingMemory.cueCount
  );

  return {
    cues: workingMemory.cues,
    blob,
    cueIds,
    offset: workingMemory.offset,
    answers: [],
    cueCount: workingMemory.cueCount,
    currentIndex: 0,
    audioContext: state.audioContext,
  };
};

export const buildWorkingMemoryAnswer = (
  workingMemoryFormState: WorkingMemoryFormState
): WorkingMemoryAnswer => {
  // 回答全体の時間 算出
  const start = workingMemoryFormState.answers[0].startAt;
  const end = workingMemoryFormState.answers.slice(-1)[0].endAt;
  const duration = Math.round((end - start) / 100) / 10;

  let correctCount = 0;
  const log: { [index: number]: WorkingMemoryAnswerLog } = {};
  workingMemoryFormState.answers.forEach((answer, index) => {
    // キュー配列と最終タップが等しければ、正答数を増加
    const correctAnswer = workingMemoryFormState.cueIds[index];
    const inputAnswer = answer.tapped.slice(-1)[0];
    if (correctAnswer === inputAnswer) {
      correctCount++;
    }

    // tapped を配列からオブジェクトに変更（firestore に2次配列が保存できないため）
    const tapped: { [index: number]: string } = {};
    answer.tapped.forEach((item, index) => {
      tapped[index] = item;
    });

    log[index] = {
      tapped,
      duration: Math.round((answer.endAt - answer.startAt) / 100) / 10,
    };
  });

  return {
    log,
    cueIds: workingMemoryFormState.cueIds,
    offset: workingMemoryFormState.offset,
    duration,
    createdAt: new Date().getTime(),
    correctRatio: Math.round(
      (correctCount / workingMemoryFormState.cueCount) * 100
    ),
  };
};

export const buildCueIds = (ids: string[], cueCount: number) => {
  const cueIds: string[] = [];
  for (let i = 0; i < cueCount; i++) {
    const lastCueId = cueIds[i - 1] || '';
    let index = getRandomInt(ids.length);
    let currentCueId = ids[index];
    if (currentCueId === lastCueId) {
      index = getRandomInt(ids.length);
      currentCueId = ids[index];
    }
    cueIds.push(currentCueId);
  }
  return cueIds;
};
