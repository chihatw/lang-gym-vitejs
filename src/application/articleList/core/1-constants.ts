import { IArticleList } from './0-interface';

export const initialState: IArticleList = {
  articleIds: [],
  initializing: true,
  hasMore: false,
  startAfter: 0,
};
