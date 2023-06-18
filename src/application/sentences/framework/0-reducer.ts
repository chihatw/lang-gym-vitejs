import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { ISentence } from '../core/0-interface';
import { RootState } from 'main';

const sentenceAdapter = createEntityAdapter<ISentence>({
  selectId: (sentence) => sentence.id,
});

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
