export const blobToAudioBuffer = async (
  blob: Blob,
  audioContext: AudioContext
) => {
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
export const shuffle = ([...array]: string[]) => {
  for (let i = array.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * max);
};

export const getBlobFromAssets = async (path: string) => {
  const response = await fetch(path);
  const blob = await response.blob();
  return blob;
};
