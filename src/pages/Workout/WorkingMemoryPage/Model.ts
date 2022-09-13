import {
  INITIAL_WORKING_MEMORY_LOG,
  WorkingMemoryCard,
  WorkingMemoryLog,
} from '../../../Model';

export type WorkingMemoryFormState = {
  id: string;
  log: WorkingMemoryLog;
  pitchBlob: Blob | null;
  toneBlob: Blob | null;
  cards: WorkingMemoryCard[];
  scene: string;
  cueIds: string[];
  offset: number;
  cueRange: string[];
  currentIndex: number;
  cueCount: number;
  audioContext: AudioContext | null;
};

export const INITIAL_WORKING_MEMORY_FORM_STATE: WorkingMemoryFormState = {
  id: '',
  log: INITIAL_WORKING_MEMORY_LOG,
  pitchBlob: null,
  toneBlob: null,
  cards: [],
  scene: '',
  cueIds: [],
  offset: 0,
  cueRange: [],
  cueCount: 0,
  currentIndex: 0,
  audioContext: null,
};
