import { IArticlePage } from './0-interface';

export const initialState: IArticlePage = {
  isLoading: false,
  recordSentenceId: '',
  isRecording: false,
  isChecking: false,
  playedRecordedAudio: false,
};
