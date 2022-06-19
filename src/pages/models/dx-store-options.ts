export class DxStoreOptions {
  Key?: string | Array<string>;
  loadUrl: string;
  onLoaded?: (result: Array<any>) => void;
  insertUrl?: string;
  deleteUrl?: string;
  deleteMethod?: string;
  loadParams?: Object;
  updateUrl?: string;
  updateMethod?: string;
  onInserted?: (values: any, key: any) => void;
  onRemoved?: (key: any) => void;
  onUpdated?: (key: any, values: any) => void;
  loadMode?: 'processed' | 'raw';
  OnBeforeSend?: (
    operation: string,
    ajaxSettings: {
      cache?: boolean;
      contentType?: any;
      data?: any;
      dataType?: string;
      headers?: {
        [key: string]: any;
      };
      method?: string;
      password?: string;
      timeout?: number;
      url?: string;
      username?: string;
      xhrFields?: {};
    },
  ) => void;
}
