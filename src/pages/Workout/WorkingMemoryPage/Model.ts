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
  numberBlob: Blob | null;
  cards: WorkingMemoryCard[];
  scene: string;
  cueIds: string[];
  offset: number;
  cueRange: string[];
  currentIndex: number;
  audioContext: AudioContext | null;
  step: number;
  baseCueCount: number;
};

export const INITIAL_WORKING_MEMORY_FORM_STATE: WorkingMemoryFormState = {
  id: '',
  log: INITIAL_WORKING_MEMORY_LOG,
  pitchBlob: null,
  toneBlob: null,
  numberBlob: null,
  cards: [],
  scene: '',
  cueIds: [],
  offset: 0,
  cueRange: [],
  currentIndex: 0,
  audioContext: null,
  step: 0,
  baseCueCount: 0,
};
