export interface UIResponse<T> {
  statusCode: number;
  isError: boolean;
  messageKey: string;
  result?: T;
  data?: T[];
  totalCount?: number;
  groupCount?: number;
  summary?: any[];
}
