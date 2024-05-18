import { AxiosError } from "axios";
import { LoginResponse, UIResponse } from "../models";
import LoginService from "./login.service";
import ToastService from "./toast.service";
import { t } from "i18next";

export async function signIn(
  username,
  password
): Promise<UIResponse<LoginResponse>> {
  try {
    // Send request

    const result = await LoginService.login({
      username: username,
      password: password,
    });

    return result;
  } catch (e) {
    if (e instanceof AxiosError) {
      if (e.response.status === 401) {
        return undefined;
      }
    }
    throw e;
  }
}

export async function signOut(): Promise<void> {
  localStorage.removeItem("Authorization");
  localStorage.removeItem("user");
  ToastService.showToast("error", t("LOGIN.TOKEN_EXPIRE"));
  await new Promise((resolve) => setTimeout(resolve, 1000));
  window.location.href = "/";
}

const AuthService = {
  signIn,
  signOut,
};
export default AuthService;
