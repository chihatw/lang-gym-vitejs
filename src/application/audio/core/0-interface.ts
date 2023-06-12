export interface IAudio {
  blob: null | Blob;
  userAudioBuffer: null | AudioBuffer;
  fetchedAudioBuffers: { [path: string]: AudioBuffer | null };
}
