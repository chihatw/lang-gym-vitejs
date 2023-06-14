import { blobToAudioBuffer } from 'application/audio/core/2-services';

export const createSourceNode = async (blob: Blob) => {
  const audioContext = new AudioContext();
  const sourceNode = audioContext.createBufferSource();
  sourceNode.buffer = await blobToAudioBuffer(blob);
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
