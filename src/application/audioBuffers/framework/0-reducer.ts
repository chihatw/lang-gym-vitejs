import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { RootState } from 'main';

const audioBufferAdapter = createEntityAdapter<{
  id: string;
  audioBuffer: AudioBuffer | undefined;
}>({
  selectId: (audioBuffer) => audioBuffer.id,
});

const audioSlice = createSlice({
  name: 'audioBuffers',
  initialState: audioBufferAdapter.getInitialState<{
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
      audioBufferAdapter.upsertMany(state, payload);
    },
    saveAudioBuffer: (
      state,
      { payload }: { payload: { id: string; audioBuffer: AudioBuffer } }
    ) => {
      audioBufferAdapter.upsertOne(state, payload);
    },
    removeFetchedAudioBuffer: (state, { payload }: { payload: string }) => {
      audioBufferAdapter.removeOne(state, payload);
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

export const { selectById: selectAudioById } = audioBufferAdapter.getSelectors(
  (state: RootState) => state.audioBuffers
);
