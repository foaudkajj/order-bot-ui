import { LoginResponse, UIResponse } from "../models";
import AxiosService from "./axios.service";

const login = async (payload: { username: string; password: string }) => {
  return AxiosService.post<LoginResponse>(`user/login`, payload);
};

const validateToken = async () => {
  return AxiosService.get<boolean>(`user/validate-token`);
};

const LoginService = {
  login,
  validateToken,
};

export default LoginService;
