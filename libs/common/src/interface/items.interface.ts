export interface IItems<T> {
  items: T[];
  limit?: number;
  page?: number;
  total: number;
}
