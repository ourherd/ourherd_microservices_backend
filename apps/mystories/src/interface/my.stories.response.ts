export interface IMyStoriesResponse<T = object> {
  state: boolean;
  progress: T;
  published: T;
  message?: string;
}

