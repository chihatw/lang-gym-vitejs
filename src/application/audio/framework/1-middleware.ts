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
        const { fetchedAudioBuffers } = (getState() as RootState).audio;

        const paths = Object.keys(fetchedAudioBuffers);

        // path がすでに存在すれば、終了
        if (paths.includes(path)) break;

        const gotAudioBuffer = await services.api.audio.fetchStorageAudioBuffer(
          path
        );
        dispatch(
          audioActions.mergeFetchedAudioBuffers({
            [path]: gotAudioBuffer || null,
          })
        );

        break;
      }
      case 'audio/getAudioBuffersStart': {
        const paths = action.payload as string[];
        const { fetchedAudioBuffers } = (getState() as RootState).audio;

        const fetchedPaths = Object.keys(fetchedAudioBuffers);

        // audioBuffers の取得
        const audioBuffers: { [path: string]: AudioBuffer | null } = {};
        await Promise.all(
          paths.map(async (path) => {
            // path がすでに存在すれば、スキップ
            if (!fetchedPaths.includes(path)) {
              const gotAudioBuffer =
                await services.api.audio.fetchStorageAudioBuffer(path);
              audioBuffers[path] = gotAudioBuffer || null;
            }
          })
        );

        dispatch(audioActions.mergeFetchedAudioBuffers(audioBuffers));
      }
      case 'audio/saveAudioBuffer': {
        const path = action.payload.path as string;
        const { blob } = (getState() as RootState).audio;
        if (!!blob) {
          await services.api.audio.uploadStorageByPath(blob, path);
          dispatch(audioActions.resetBlobAndAudioBuffer());
          break;
        }
        break;
      }
      case 'audio/removeFetchedAudioBuffer': {
        const path = action.payload as string;
        await services.api.audio.deleteStorageByPath(path);
        break;
      }
      default:
    }
  };

export default [audioMiddleWare];
