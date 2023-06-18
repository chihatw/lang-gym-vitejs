export interface IAudio {
  recordedBlob: Blob | undefined;
  recordedAudioBuffer: AudioBuffer | undefined;
  fetchedAudioBuffers: { [path: string]: AudioBuffer | undefined };
}
