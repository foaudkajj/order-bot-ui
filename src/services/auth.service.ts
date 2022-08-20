import { LoginResponse, UIResponse } from "../models";
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

    return result;
  } catch (e) {
    throw e;
  }
}

const AuthService = {
  signIn,
};
export default AuthService;
