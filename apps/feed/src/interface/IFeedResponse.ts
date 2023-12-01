export interface IFeedResponse<T = object> {
  state: boolean;
  stories: T;
  saved: T;
  message?: string;
}
