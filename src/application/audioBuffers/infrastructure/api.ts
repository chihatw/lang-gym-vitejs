import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage';
import { storage } from 'infrastructure/firebase';
import { blobToAudioBuffer } from '../core/2-services';

export const ARTILCE_STORAGE_PATH = 'articles/';
export const ASSIGNMENTS_STORAGE_PATH = 'assignments/';

export const uploadStorageByPath = async (blob: Blob, path: string) => {
  const storageRef = ref(storage, path);
  // Blob 経由でファイルをアップロード
  uploadBytes(storageRef, blob)
    .then(() => console.log(`%c"${path}" uploaded`, 'color:red'))
    .catch((error) => console.error(error));
};

export const deleteStorageByPath = async (path: string) => {
  const storageRef = ref(storage, path);
  deleteObject(storageRef)
    .then(() => console.log(`%c"${path}" deleted`, 'color:red'))
    .catch((err) => console.error(err));
};

export const fetchStorageAudioBuffer = async (path: string) => {
  let storagePath = '';
  try {
    console.log(`%cgetDownloadURL ${path}`, 'color:red');
    storagePath = await getDownloadURL(ref(storage, path));
  } catch (e) {
    console.warn(e);
  }
  if (!storagePath) return;

  return await fetchAudioBuffer(storagePath);
};

const fetchAudioBuffer = async (path: string) => {
  console.log(`%cfetch ${path}`, 'color:red');
  const response = await fetch(path);

  if (!response) return;

  const blob = await response.blob();
  if (!blob) return;

  const audioBuffer = await blobToAudioBuffer(blob);
  return audioBuffer;
};
