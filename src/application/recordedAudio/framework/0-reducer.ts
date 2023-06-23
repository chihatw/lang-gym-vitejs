import { createSlice } from '@reduxjs/toolkit';
import { initialState } from '../core/1-constants';

const recordedAudioSlice = createSlice({
  name: 'recordedAudio',
  initialState: initialState,
  reducers: {
    setRecordedAudio: (
      state,
      {
        payload: { recordedAudioBuffer, recordedBlob },
      }: { payload: { recordedBlob: Blob; recordedAudioBuffer: AudioBuffer } }
    ) => {
      state.blob = recordedBlob;
      state.audioBuffer = recordedAudioBuffer;
    },
    resetRecordedAudio: (state) => {
      state.audioBuffer = undefined;
      state.blob = undefined;
    },
  },
});

export const recordedAudioActions = recordedAudioSlice.actions;

export default recordedAudioSlice.reducer;
