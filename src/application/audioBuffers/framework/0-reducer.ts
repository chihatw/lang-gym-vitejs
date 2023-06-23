import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { RootState } from 'main';
import { IAudioBuffer } from '../core/0-interface';

const audioBufferAdapter = createEntityAdapter<IAudioBuffer>({
  selectId: (audioBuffer) => audioBuffer.id,
});

const audioSlice = createSlice({
  name: 'audioBuffers',
  initialState: audioBufferAdapter.getInitialState(),
  reducers: {
    getAudioBufferStart: (state, { payload }: { payload: string }) => state,
    getAudioBuffersStart: (state, { payload }: { payload: string[] }) => state,
    mergeFetchedAudioBuffers: (
      state,
      {
        payload,
      }: {
        payload: { [id: string]: IAudioBuffer };
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
  },
});

export const audioBuffersActions = audioSlice.actions;

export default audioSlice.reducer;

export const { selectById: selectAudioById } = audioBufferAdapter.getSelectors(
  (state: RootState) => state.audioBuffers
);
