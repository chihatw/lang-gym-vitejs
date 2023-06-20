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
      case 'audioBuffers/getAudioBufferStart': {
        const path = action.payload as string;
        const audioBuffers = (getState() as RootState).audioBuffers.entities;

        const paths = Object.keys(audioBuffers);

        // path がすでに存在すれば、終了
        if (paths.includes(path)) break;

        const gotAudioBuffer =
          await services.api.audioBuffers.fetchStorageAudioBuffer(path);
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
      case 'audioBuffers/getAudioBuffersStart': {
        const paths = action.payload as string[];
        const audioBuffers = (getState() as RootState).audioBuffers.entities;

        const fetchedPaths = Object.keys(audioBuffers);

        // audioBuffers の取得
        const gotAudioBuffers: {
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
                await services.api.audioBuffers.fetchStorageAudioBuffer(path);
              gotAudioBuffers[path] = {
                id: path,
                audioBuffer: gotAudioBuffer,
              };
            }
          })
        );

        dispatch(audioActions.mergeFetchedAudioBuffers(gotAudioBuffers));
        return;
      }
      case 'audioBuffers/saveAudioBuffer': {
        const path = action.payload.id as string;
        const recordedBlob = (getState() as RootState).audioBuffers
          .recordedBlob;

        if (!recordedBlob) return;

        await services.api.audioBuffers.uploadStorageByPath(recordedBlob, path);
        dispatch(audioActions.resetRecordedAudio());
        return;
      }
      case 'audioBuffers/removeFetchedAudioBuffer': {
        const path = action.payload as string;
        await services.api.audioBuffers.deleteStorageByPath(path);
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
