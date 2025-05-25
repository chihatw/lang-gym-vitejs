import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { RootState } from 'main';
import { ISentence } from '../core/0-interface';

const sentenceAdapter = createEntityAdapter<ISentence>();

const sentencesSlice = createSlice({
  name: 'sentences',
  initialState: sentenceAdapter.getInitialState(),
  reducers: {
    getSentencesStart: (state, { payload }: { payload: string }) => state,
    upsertSentences: (state, { payload }: { payload: ISentence[] }) => {
      sentenceAdapter.upsertMany(state, payload);
    },
  },
});

export const sentencesActions = sentencesSlice.actions;

export default sentencesSlice.reducer;

export const { selectById: selectSentenceById } = sentenceAdapter.getSelectors(
  (state: RootState) => state.sentences
);
