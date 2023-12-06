export interface IFeedResponse<T = object> {
  state: boolean;
  feed: T;
  saved: T;
  message?: string;
}

