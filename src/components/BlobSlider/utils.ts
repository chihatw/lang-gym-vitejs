export const currentTimeToSliderValue = (
  currentTime: number,
  duration: number
): number => {
  const value = duration ? (currentTime / duration) * 100 : 0;
  return Math.min(Math.max(value, 0), 100);
};

export const sliderValueToCurrentTime = (
  sliderValue: number,
  duration: number
): number => {
  return (duration * sliderValue) / 100;
};

const blobToAudioBuffer = async (blob: Blob, audioContext: AudioContext) => {
  const arrayBuffer = await blob.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  return audioBuffer;
};

export const createSourceNode = async (
  blob: Blob,
  audioContext: AudioContext
) => {
  const sourceNode = audioContext.createBufferSource();
  sourceNode.buffer = await blobToAudioBuffer(blob, audioContext);
  sourceNode.connect(audioContext.destination);
  return sourceNode;
};
