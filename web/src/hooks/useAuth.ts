import { useAppContext } from "../components/AppProvider";
import { useApi } from "./useApi";

export const useAuth = () => {
  const { setUser, setLoggedIn } = useAppContext();
  const { postApi } = useApi();

  const login = (email, password) => {
    return postApi("/login", { email, password }).then(({ token, user }) => {
      localStorage.setItem("token", token);
      setLoggedIn(true);
    });
  };

  const logout = () => {
    console.log("logout");
    localStorage.removeItem("token");
    setLoggedIn(false);
    setUser(null);
  };

  return { login, logout };
};
