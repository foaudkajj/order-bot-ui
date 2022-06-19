import { LoginResponse } from "../pages/models";
import AxiosService from "./axios.service";

const login = async (payload: { username: string; password: string }) => {
  return AxiosService.post<LoginResponse>(`User/Login`, payload);
};

const LoginService = {
  login,
};

export default LoginService;
