import axios, { AxiosResponse } from "axios";
import i18n from "i18next";
import { UIResponse } from "../models";
import ToastService from "./toast.service";



const client = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

client.interceptors.request.use(function (config) {
  const token = sessionStorage.getItem("Authorization");
  config.headers.Authorization = token ? `Bearer ${token}` : '';
  return config;
});


async function get<T>(url: string) {
  try {
    
    const result = await client.request<T, AxiosResponse<UIResponse<T>>>({
      method: "GET",
      url,
      responseType: "json",
    });

    if (result.status !== 200 || result.data.isError) {
      if (result.data.messageKey !== "") {
        ToastService.showToast(
          "error",
          i18n.t(result.data.messageKey ?? "MESSAGES.UNSUCCESSFUL_OPERATION")
        );
      } else {
        ToastService.showToast(
          "error",
          i18n.t("MESSAGES.UNSUCCESSFUL_OPERATION")
        );
      }
    }

    return result.data;
  } catch (error) {
    ToastService.showToast("error", i18n.t("MESSAGES.UNSUCCESSFUL_OPERATION"));
  }
  return undefined;
}

async function post<T>(url: string, payload: Object) {
  try {
    const result = await client.request<T, AxiosResponse<UIResponse<T>>>({
      method: "POST",
      url,
      responseType: "json",
      data: payload,
    });

    if (
      (result.status !== 200 && result.status !== 201) ||
      result.data.isError
    ) {
      if (result.data.messageKey !== "") {
        ToastService.showToast(
          "error",
          i18n.t(result.data.messageKey ?? "MESSAGES.UNSUCCESSFUL_OPERATION")
        );
      } else {
        ToastService.showToast(
          "error",
          i18n.t("MESSAGES.UNSUCCESSFUL_OPERATION")
        );
      }
    }

    return result.data;
  } catch (error) {
    ToastService.showToast("error", i18n.t("MESSAGES.UNSUCCESSFUL_OPERATION"));
  }
  return undefined;
}

async function put<T>(url: string, payload: Object) {
  try {
    const result = await client.request<T, AxiosResponse<UIResponse<T>>>({
      method: "PUT",
      url,
      responseType: "json",
      data: payload,
    });

    if (result.status !== 200 || result.data.isError) {
      if (result.data.messageKey !== "") {
        ToastService.showToast(
          "error",
          i18n.t(result.data.messageKey ?? "MESSAGES.UNSUCCESSFUL_OPERATION")
        );
      } else {
        ToastService.showToast(
          "error",
          i18n.t("MESSAGES.UNSUCCESSFUL_OPERATION")
        );
      }
    }

    return result.data;
  } catch (error) {
    ToastService.showToast("error", i18n.t("MESSAGES.UNSUCCESSFUL_OPERATION"));
  }
  return undefined;
}

const AxiosService = {
  post,
  get,
  put,
};

export default AxiosService;
