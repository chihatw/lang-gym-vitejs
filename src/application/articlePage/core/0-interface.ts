export interface IArticlePage {
  articleId: string;
  isChecking: boolean;
  isRecording: boolean;
  initializing: boolean;
  recordSentenceId: string;
  playedRecordedAudio: boolean;
}
