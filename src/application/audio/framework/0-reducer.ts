import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { RootState } from 'main';

const audioAdapter = createEntityAdapter<{
  id: string;
  audioBuffer: AudioBuffer | undefined;
}>({
  selectId: (audio) => audio.id,
});

const audioSlice = createSlice({
  name: 'audio',
  initialState: audioAdapter.getInitialState<{
    recordedBlob: Blob | undefined;
    recordedAudioBuffer: AudioBuffer | undefined;
  }>({ recordedBlob: undefined, recordedAudioBuffer: undefined }),
  reducers: {
    getAudioBufferStart: (state, { payload }: { payload: string }) => state,
    getAudioBuffersStart: (state, { payload }: { payload: string[] }) => state,
    mergeFetchedAudioBuffers: (
      state,
      {
        payload,
      }: {
        payload: {
          [id: string]: {
            id: string;
            audioBuffer: AudioBuffer | undefined;
          };
        };
      }
    ) => {
      audioAdapter.upsertMany(state, payload);
    },
    saveAudioBuffer: (
      state,
      { payload }: { payload: { id: string; audioBuffer: AudioBuffer } }
    ) => {
      audioAdapter.upsertOne(state, payload);
    },
    removeFetchedAudioBuffer: (state, { payload }: { payload: string }) => {
      const fetchedAudioBuffers = { ...state.entities };
      delete fetchedAudioBuffers[payload];
      state.entities = fetchedAudioBuffers;
    },
    setBlobAndAudioBuffer: (
      state,
      {
        payload: { recordedBlob, recordedAudioBuffer },
      }: { payload: { recordedBlob: Blob; recordedAudioBuffer: AudioBuffer } }
    ) => {
      state.recordedBlob = recordedBlob;
      state.recordedAudioBuffer = recordedAudioBuffer;
    },
    resetRecordedAudio: (state) => {
      state.recordedBlob = undefined;
      state.recordedAudioBuffer = undefined;
    },
  },
});

export const audioActions = audioSlice.actions;

export default audioSlice.reducer;

export const { selectById: selectAudioById } = audioAdapter.getSelectors(
  (state: RootState) => state.audio
);
