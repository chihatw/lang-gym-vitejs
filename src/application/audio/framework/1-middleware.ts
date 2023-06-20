import { AnyAction, Middleware } from '@reduxjs/toolkit';
import { audioActions } from './0-reducer';
import { Services } from 'infrastructure/services';
import { RootState } from 'main';

const audioMiddleWare =
  (services: Services): Middleware =>
  ({ dispatch, getState }) =>
  (next) =>
  async (action: AnyAction) => {
    next(action);
    switch (action.type) {
      case 'audio/getAudioBufferStart': {
        const path = action.payload as string;
        const fetchedAudioBuffers = (getState() as RootState).audio.entities;

        const paths = Object.keys(fetchedAudioBuffers);

        // path がすでに存在すれば、終了
        if (paths.includes(path)) break;

        const gotAudioBuffer = await services.api.audio.fetchStorageAudioBuffer(
          path
        );
        dispatch(
          audioActions.mergeFetchedAudioBuffers({
            [path]: {
              id: path,
              audioBuffer: gotAudioBuffer || undefined,
            },
          })
        );

        return;
      }
      case 'audio/getAudioBuffersStart': {
        const paths = action.payload as string[];
        const fetchedAudioBuffers = (getState() as RootState).audio.entities;

        const fetchedPaths = Object.keys(fetchedAudioBuffers);

        // audioBuffers の取得
        const audioBuffers: {
          [id: string]: {
            id: string;
            audioBuffer: AudioBuffer | undefined;
          };
        } = {};
        await Promise.all(
          paths.map(async (path) => {
            // path がすでに存在すれば、スキップ
            if (!fetchedPaths.includes(path)) {
              const gotAudioBuffer =
                await services.api.audio.fetchStorageAudioBuffer(path);
              audioBuffers[path] = {
                id: path,
                audioBuffer: gotAudioBuffer,
              };
            }
          })
        );

        dispatch(audioActions.mergeFetchedAudioBuffers(audioBuffers));
        return;
      }
      case 'audio/saveAudioBuffer': {
        const path = action.payload.path as string;
        const { recordedBlob } = (getState() as RootState).audio;

        if (!recordedBlob) return;

        await services.api.audio.uploadStorageByPath(recordedBlob, path);
        dispatch(audioActions.resetRecordedAudio());
        return;
      }
      case 'audio/removeFetchedAudioBuffer': {
        const path = action.payload as string;
        await services.api.audio.deleteStorageByPath(path);
        return;
      }
      case 'ranomWorkoutPage/abandomRecordedAudioBuffer': {
        dispatch(audioActions.resetRecordedAudio());
        return;
      }
      default:
    }
  };

export default [audioMiddleWare];
