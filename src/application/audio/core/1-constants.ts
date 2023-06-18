import { IAudio } from './0-interface';

export const initialState: IAudio = {
  recordedBlob: undefined,
  recordedAudioBuffer: undefined,
  fetchedAudioBuffers: {},
};

export const ARTILCE_STORAGE_PATH = 'articles/';
export const ASSIGNMENTS_STORAGE_PATH = 'assignments/';
