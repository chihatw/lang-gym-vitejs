import { createSlice } from '@reduxjs/toolkit';
import { initialState } from '../core/1-constants';

const recordedAudioSlice = createSlice({
  name: 'recordedAudio',
  initialState: initialState,
  reducers: {},
});

export const recordedAudioActions = recordedAudioSlice.actions;

export default recordedAudioSlice.reducer;
