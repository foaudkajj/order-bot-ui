import { LoginResponse, UIResponse } from "../pages/models";
import LoginService from "./login.service";

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

    return result ?? errorResponse;
  } catch {
    return errorResponse;
  }
}

const AuthService = {
  signIn,
};

const errorResponse = {
  StatusCode: 500,
  IsError: true,
  MessageKey: "ERROR",
};
export default AuthService;
