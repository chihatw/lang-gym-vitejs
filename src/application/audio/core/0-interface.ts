export interface IAudio {
  recordedBlob: Blob | undefined;
  recordedAudioBuffer: AudioBuffer | undefined;
  fetchedAudioBuffers: {
    [id: string]: {
      // id = path
      id: string;
      audioBuffer: AudioBuffer | undefined;
    };
  };
}
