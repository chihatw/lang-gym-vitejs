import { WorkingMemoryCue } from '../../../Model';

export type WorkingMemoryFormAnswerLog = {
  tapped: string[];
  startAt: number;
  endAt: number;
};

export const INITIAL_WORKING_MEMORY_FORM_ANSWER_LOG: WorkingMemoryFormAnswerLog =
  {
    tapped: [],
    startAt: 0,
    endAt: 0,
  };

export type WorkingMemoryFormState = {
  cues: { [id: string]: WorkingMemoryCue };
  blob: Blob | null;
  cueIds: string[];
  offset: number;
  cueCount: number;
  answers: WorkingMemoryFormAnswerLog[];
  currentIndex: number;
  audioContext: AudioContext | null;
};

export const INITIAL_WORKING_MEMORY_FORM_STATE: WorkingMemoryFormState = {
  cues: {},
  blob: null,
  cueIds: [],
  offset: 0,
  answers: [],
  cueCount: 0,
  currentIndex: 0,
  audioContext: null,
};
