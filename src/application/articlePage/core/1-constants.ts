import { IArticlePage } from './0-interface';

export const initialState: IArticlePage = {
  articleId: '',
  isChecking: false,
  isRecording: false,
  recordSentenceId: '',
  playedRecordedAudio: false,
};
