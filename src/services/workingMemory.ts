import downpitch_120 from '../assets/audios/downpitch_120.mp3';
import ma_tones from '../assets/audios/ma_tones.mp3';
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
  State,
  INITIAL_WORKING_MEMORY,
  INITIAL_WORKING_MEMORY_LOG,
  WorkingMemory,
} from '../Model';
import {
  WorkingMemoryFormState,
  INITIAL_WORKING_MEMORY_FORM_STATE,
} from '../pages/Workout/WorkingMemoryPage/Model';
import { db, storage } from '../repositories/firebase';
import { getRandomInt } from './utils';
import { nanoid } from 'nanoid';
import { TONES } from '../assets/tone';
import { PITCHES } from '../assets/pitch';

const COLLECTIONS = {
  workingMemories: 'workingMemories',
};

export const getWorkingMemories = async (uid: string) => {
  const workingMemories: { [id: string]: WorkingMemory } = {};
  const q = query(
    collection(db, COLLECTIONS.workingMemories),
    where('uid', '==', uid),
    where('isActive', '==', true),
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
    logs,
    cueIds,
    title,
    offset,
    isActive,
    createdAt,
    step,
    baseCueCount,
  } = doc.data();
  return {
    id: doc.id,
    uid: uid || '',
    logs: logs || {},
    step: step || 1,
    title: title || '',
    cueIds: cueIds || [],
    offset: offset || 0,
    isActive: isActive || false,
    createdAt: createdAt || 0,
    baseCueCount: baseCueCount || 4,
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
  workoutId: string
): WorkingMemoryFormState => {
  const workingMemory = state.workingMemories[workoutId];
  if (!workingMemory) return INITIAL_WORKING_MEMORY_FORM_STATE;

  const cueCount =
    workingMemory.baseCueCount + workingMemory.step * workingMemory.offset;

  const cueIds: string[] = buildCueIds(workingMemory.cueIds, cueCount);
  const cards = [
    ...Object.values(TONES).map((item) => ({ ...item, type: 'tone' })),
    ...Object.values(PITCHES).map((item) => ({ ...item, type: 'pitch' })),
  ];
  return {
    id: workoutId,
    pitchBlob: state.blobs[downpitch_120],
    toneBlob: state.blobs[ma_tones],
    scene: 'opening',
    offset: workingMemory.offset,
    step: workingMemory.step,
    baseCueCount: workingMemory.baseCueCount,
    cards,
    cueIds,
    cueRange: workingMemory.cueIds,
    log: {
      ...INITIAL_WORKING_MEMORY_LOG,
      id: nanoid(8),
      cueIds,
      offset: workingMemory.offset,
      createdAt: Date.now(),
    },
    currentIndex: 0,
    audioContext: state.audioContext,
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

export const getTodaysLogCount = (workingMemory: WorkingMemory) => {
  let todaysLogCount = 0;
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const logs = workingMemory.logs;
  for (const log of Object.values(logs)) {
    const answerDay = new Date(log.createdAt);
    // log の日付が「今日」
    if (
      year === answerDay.getFullYear() &&
      month === answerDay.getMonth() + 1 &&
      day === answerDay.getDate()
    ) {
      // 結果画面が表示されている場合、試行回数としてカウント
      if (log.result.createdAt) {
        todaysLogCount++;
      }
    }
  }
  return todaysLogCount;
};
