import * as rtk from '@reduxjs/toolkit';

import reducer from 'application/0-store/reducer';
import { Services } from 'infrastructure/services';
import middleware from './middleware';

const serializableCheck = {
  ignoredActions: [
    'audioBuffers/saveAudioBuffer',
    'recordedAudio/setRecordedAudio',
    'audioBuffers/mergeFetchedAudioBuffers',
  ],
  ignoredPaths: [
    'audioBuffers.entities',
    'recordedAudio.blob',
    'recordedAudio.audioBuffer',
  ],
};

export const configureStore = import.meta.env.DEV
  ? // 開発の場合
    (services: Services) =>
      rtk.configureStore({
        reducer,
        middleware: (getDefaultMiddleware) =>
          getDefaultMiddleware({ serializableCheck })
            // .concat(logger) // logger を挟む
            .concat([...middleware].map((f) => f(services))),
        devTools: import.meta.env.DEV,
      })
  : // 本番の場合
    (services: Services) =>
      rtk.configureStore({
        reducer,
        middleware: (getDefaultMiddleware) =>
          getDefaultMiddleware({ serializableCheck }).concat(
            [...middleware].map((f) => f(services))
          ),
        devTools: import.meta.env.DEV,
      });
