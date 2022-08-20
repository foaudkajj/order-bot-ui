export interface UIResponse<T> {
  data?: T;
  totalCount?: number;
  groupCount?: number;
  summary?: any[];
}
