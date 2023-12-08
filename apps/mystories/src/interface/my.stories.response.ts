export interface IMyStoriesResponse<T = object> {
  state: boolean;
  total_progress: number;
  progress: T;
  published: T;
  message?: string;
}

