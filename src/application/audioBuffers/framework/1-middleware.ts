import { Middleware } from '@reduxjs/toolkit';
import { recordedAudioActions } from 'application/recordedAudio/framework/0-reducer';
import { Services } from 'infrastructure/services';
import { RootState } from 'main';
import { audioBuffersActions } from './0-reducer';

const audioMiddleWare =
  (services: Services): Middleware =>
  ({ dispatch, getState }) =>
  (next) =>
  (action: unknown): unknown => {
    next(action as any);
    // 型アサーション
    const typedAction = action as { type: string; payload?: any };
    switch (typedAction.type) {
      case 'audioBuffers/getAudioBufferStart': {
        (async () => {
          const path = typedAction.payload as string;
          const audioBuffers = (getState() as RootState).audioBuffers.entities;
          const paths = Object.keys(audioBuffers);
          if (paths.includes(path)) return;
          const gotAudioBuffer =
            await services.api.audioBuffers.fetchStorageAudioBuffer(path);
          dispatch(
            audioBuffersActions.mergeFetchedAudioBuffers({
              [path]: {
                id: path,
                audioBuffer: gotAudioBuffer || undefined,
              },
            })
          );
        })();
        return;
      }
      case 'audioBuffers/getAudioBuffersStart': {
        (async () => {
          const paths = typedAction.payload as string[];
          const audioBuffers = (getState() as RootState).audioBuffers.entities;
          const fetchedPaths = Object.keys(audioBuffers);
          const gotAudioBuffers: {
            [id: string]: {
              id: string;
              audioBuffer: AudioBuffer | undefined;
            };
          } = {};
          await Promise.all(
            paths.map(async (path) => {
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
          dispatch(
            audioBuffersActions.mergeFetchedAudioBuffers(gotAudioBuffers)
          );
        })();
        return;
      }
      case 'audioBuffers/saveAudioBuffer': {
        (async () => {
          const path = typedAction.payload.id as string;
          const recordedBlob = (getState() as RootState).recordedAudio.blob;
          if (!recordedBlob) return;
          await services.api.audioBuffers.uploadStorageByPath(
            recordedBlob,
            path
          );
          dispatch(recordedAudioActions.resetRecordedAudio());
        })();
        return;
      }
      case 'audioBuffers/removeFetchedAudioBuffer': {
        (async () => {
          const path = typedAction.payload as string;
          await services.api.audioBuffers.deleteStorageByPath(path);
        })();
        return;
      }
      case 'ranomWorkoutPage/abandomRecordedAudioBuffer': {
        dispatch(recordedAudioActions.resetRecordedAudio());
        return;
      }
      default:
    }
    return next(action as any);
  };

export default [audioMiddleWare];
