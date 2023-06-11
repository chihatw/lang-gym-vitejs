export interface IArticleList {
  articleIds: string[];
  initializing: boolean;
  hasMore: boolean;
  startAfter: number;
}
