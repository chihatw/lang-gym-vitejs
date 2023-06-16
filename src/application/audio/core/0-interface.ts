export interface IAudio {
  recordedBlob: Blob | null;
  recordedAudioBuffer: AudioBuffer | null;
  fetchedAudioBuffers: { [path: string]: AudioBuffer | null };
}
