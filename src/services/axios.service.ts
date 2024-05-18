import axios, { AxiosError, AxiosResponse } from "axios";
import { UIResponse } from "../models";
import AuthService from "./auth.service";

const client = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

client.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    if (
      error.response.status === 401 &&
      !error?.config?.url?.toLowerCase().includes("login")
    ) {
      await AuthService.signOut();
    }
    return Promise.reject(error);
  }
);

client.interceptors.request.use(function (config) {
  const token = localStorage.getItem("Authorization");
  config.headers.Authorization = token ? `Bearer ${token}` : "";
  return config;
});

async function get<T>(url: string) {
  try {
    const result = await client.request<T, AxiosResponse<UIResponse<T>>>({
      method: "GET",
      url,
      responseType: "json",
    });
    return result.data;
  } catch (e) {
    // if (e instanceof AxiosError) {
    //   ToastService.showToast("error", i18n.t(e?.cause?.message));
    // }
    throw e;
  }
}

async function post<T>(url: string, payload: Object) {
  try {
    const result = await client.request<T, AxiosResponse<UIResponse<T>>>({
      method: "POST",
      url,
      responseType: "json",
      data: payload,
    });

    return result.data;
  } catch (e) {
    // if (e instanceof AxiosError) {
    //   ToastService.showToast("error", i18n.t(e?.cause?.message));
    // }
    throw e;
  }
}

async function put<T>(url: string, payload: Object) {
  try {
    const result = await client.request<T, AxiosResponse<UIResponse<T>>>({
      method: "PUT",
      url,
      responseType: "json",
      data: payload,
    });

    return result.data;
  } catch (e) {
    // if (e instanceof AxiosError) {
    //   ToastService.showToast("error", i18n.t(e?.cause?.message));
    // }
    throw e;
  }
}

const AxiosService = {
  post,
  get,
  put,
};

export default AxiosService;
