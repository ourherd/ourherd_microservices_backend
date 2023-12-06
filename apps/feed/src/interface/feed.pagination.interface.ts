export interface IFeedPaginationInterface<T> {
  stories: T[];
  limit?: number;
  page?: number;
  total?: number;
}
