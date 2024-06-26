import React, {
  useState,
  createContext,
  useContext,
  useCallback,
  useEffect,
} from "react";
import { LoginResponse } from "../models";
import { signIn as sendSignInRequest } from "../services/index";

function AuthProvider(props) {
  const [user, setUser] = useState<LoginResponse>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async function () {
      const user = JSON.parse(
        localStorage.getItem("user") ?? "false"
      ) as LoginResponse;
      const token = localStorage.getItem("Authorization");
      if (user && token) {
        setUser(user);
      }
      setLoading(false);
    })();
  }, []);

  const signIn = useCallback(async (username, password) => {
    setLoading(true);
    const result = await sendSignInRequest(username, password);
    if (result?.data?.isAuthenticated) {
      setUser(result.data);
      localStorage.setItem("Authorization", result.data.token);
      localStorage.setItem("user", JSON.stringify(result.data));
    } else {
      setUser(null);
    }

    setLoading(false);
    return result;
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem("Authorization");
    localStorage.removeItem("user");
    setUser(undefined);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, signIn, signOut, loading }}
      {...props}
    />
  );
}

const AuthContext = createContext<{
  loading: boolean;
  signIn?: any;
  signOut?: any;
  user: LoginResponse;
}>({
  loading: false,
  user: undefined,
});
const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
