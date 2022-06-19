import React, {
  useState,
  createContext,
  useContext,
  useCallback,
  useEffect,
} from "react";
import { LoginResponse } from "../pages/models";
import { signIn as sendSignInRequest } from "../services/index";

function AuthProvider(props) {
  const [user, setUser] = useState<LoginResponse>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async function () {
      const user = JSON.parse(
        localStorage.getItem("user") ?? "false"
      ) as LoginResponse;
      const token = sessionStorage.getItem("Authorization");
      if (user && token) {
        setUser(user);
      }
      setLoading(false);
    })();
  }, [user]);

  const signIn = useCallback(async (username, password) => {
    setLoading(true);
    const result = await sendSignInRequest(username, password);
    if (result?.Result.IsAuthenticated) {
      setUser(result.Result);
      sessionStorage.setItem("Authorization", result.Result.Token);
      localStorage.setItem("user", JSON.stringify(result.Result));
    } else {
      setUser(null);
    }

    setLoading(false);
    return result;
  }, []);

  const signOut = useCallback(() => {
    sessionStorage.removeItem("Authorization");
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
