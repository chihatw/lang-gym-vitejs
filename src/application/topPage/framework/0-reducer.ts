import { createSlice } from '@reduxjs/toolkit';
import { initialState } from '../core/1-constants';

const topPageSlice = createSlice({
  name: 'topPage',
  initialState,
  reducers: {
    initiate: (state) => {
      state.initializing = false;
    },
    setArticleIds: (
      state,
      { payload }: { payload: { articleIds: string[]; hasMore: boolean } }
    ) => {
      state.articleIds = payload.articleIds;
      state.hasMore = payload.hasMore;
    },
    resetState: () => initialState,
  },
});

export const topPageActions = topPageSlice.actions;

export default topPageSlice.reducer;
