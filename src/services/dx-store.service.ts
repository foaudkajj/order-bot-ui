import CustomStore from "devextreme/data/custom_store";
import { createStore } from "devextreme-aspnet-data-nojquery";
import ToastService from "./toast.service";
import { DxStoreOptions, UIResponse } from "../pages/models";

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
      if (storeOptions.onInserted) storeOptions.onInserted(values, key);
      else if (!values.isError) ToastService.showToast("success");
    },
    onLoaded: (result: Array<any>) => {
      if (storeOptions.onLoaded) storeOptions?.onLoaded(result);
    },
    onRemoved: (key) => {
      if (storeOptions.onRemoved) {
        storeOptions.onRemoved(key);
      } else ToastService.showToast("success");
    },
    onUpdated: (key, values) => {
      if (storeOptions.onUpdated) storeOptions.onUpdated(key, values);
      else ToastService.showToast("success");
    },
    onBeforeSend: (method, ajaxOptions) => {
      if (sessionStorage.getItem("Authorization")) {
        ajaxOptions.headers = {
          Authorization: "Bearer " + sessionStorage.getItem("Authorization"),
        };
      }
      return storeOptions.OnBeforeSend;
    },
    errorHandler: (e: Error) => ToastService.showToast("error"),
  });
};

const DxStoreService = {
  getStore,
};

export default DxStoreService;
