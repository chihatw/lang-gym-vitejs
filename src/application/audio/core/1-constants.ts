import { IAudio } from './0-interface';

export const initialState: IAudio = {
  blob: null,
  userAudioBuffer: null,
  fetchedAudioBuffers: {},
};

export const ARTILCE_STORAGE_PATH = 'articles/';
export const ASSIGNMENTS_STORAGE_PATH = 'assignments/';
