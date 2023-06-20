export interface IAudioBuffer {
  fetchedAudioBuffers: {
    [id: string]: {
      // id = path
      id: string;
      audioBuffer: AudioBuffer | undefined;
    };
  };
}
