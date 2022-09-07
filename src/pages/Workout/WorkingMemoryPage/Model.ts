import { INITIAL_WORKING_MEMORY_LOG, WorkingMemoryLog } from '../../../Model';

export type WorkingMemoryFormState = {
  id: string;
  log: WorkingMemoryLog;
  blob: Blob | null;
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
  blob: null,
  scene: '',
  cueIds: [],
  offset: 0,
  cueRange: [],
  cueCount: 0,
  currentIndex: 0,
  audioContext: null,
};
