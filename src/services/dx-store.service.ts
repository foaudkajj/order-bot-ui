import CustomStore from "devextreme/data/custom_store";
import { createStore } from "devextreme-aspnet-data-nojquery";
import { DxStoreOptions, UIResponse } from "../models";

const getStore = (storeOptions: DxStoreOptions): CustomStore => {
  return createStore({
    key: storeOptions.Key,
    loadUrl: (process.env.REACT_APP_API_URL ?? "") + storeOptions.loadUrl,
    insertUrl: (process.env.REACT_APP_API_URL ?? "") + storeOptions.insertUrl,
    updateUrl: (process.env.REACT_APP_API_URL ?? "") + storeOptions.updateUrl,
    deleteUrl: (process.env.REACT_APP_API_URL ?? "") + storeOptions.deleteUrl,
    loadParams: storeOptions.loadParams,
    updateMethod: storeOptions.updateMethod,
    deleteMethod: storeOptions.deleteMethod,
    loadMode: storeOptions.loadMode,
    onInserted: (values: UIResponse<any>, key) => {
      if (storeOptions.onInserted) {
        storeOptions.onInserted(values, key);
      }
    },
    onLoaded: (result: Array<any>) => {
      if (storeOptions.onLoaded) {
        storeOptions?.onLoaded(result);
      }
    },
    onRemoved: (key) => {
      if (storeOptions.onRemoved) {
        storeOptions.onRemoved(key);
      }
    },
    onUpdated: (key, values) => {
      if (storeOptions.onUpdated) {
        storeOptions.onUpdated(key, values);
      }
    },
    onBeforeSend: (method, ajaxOptions) => {
      if (localStorage.getItem("Authorization")) {
        ajaxOptions.headers = {
          Authorization: "Bearer " + localStorage.getItem("Authorization"),
        };
      }
      return storeOptions.OnBeforeSend;
    },
    errorHandler: (e: Error) => {
      if (storeOptions.errorHandler) {
        storeOptions.errorHandler(e);
      }
    },
  });
};

const DxStoreService = {
  getStore,
};

export default DxStoreService;
