import React, {
  createContext,
  useState,
  useContext,
  SetStateAction,
  Dispatch,
  useEffect,
} from "react";
import { User } from "../types";
import { useNavigate } from "react-router-dom";
import { useApi } from "../hooks/useApi";

const AppContext = createContext<{
  loginVisible: boolean;
  setLoginVisible: Dispatch<SetStateAction<boolean>>;
  user: User | null;
  setUser: Dispatch<SetStateAction<User>>;
  loggedIn: boolean;
  setLoggedIn: Dispatch<SetStateAction<boolean>>;
  threads: any[];
  localities: any[];
  setThreads: Dispatch<SetStateAction<any[]>>;
  getMe: () => void;
  address: any;
}>({
  loginVisible: false,
  setLoginVisible: function () {},
  user: null,
  setUser: function () {},
  loggedIn: false,
  setLoggedIn: function () {},
  threads: [],
  setThreads: function () {},
  localities: [],
  getMe: function () {},
  address: null,
});

// Step 2: Create a provider component
export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [loginVisible, setLoginVisible] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [address, setAddress] = useState<any>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [threads, setThreads] = useState<any[]>([]);
  const [localities, setLocalities] = useState<any[]>([]);

  const navigate = useNavigate();
  const { getApi } = useApi();

  const getMe = () => {
    getApi("/me")
      .then((data) => {
        setUser(data.user);
        setLocalities(data.localities);
        setAddress(data.address);
        setLoggedIn(true);
      })
      .catch((err) => {
        console.log("err", err);
        setLoggedIn(false);
        navigate("/login");
      });
  };

  useEffect(() => {
    if (loggedIn) {
      getMe();
    } else {
      // setUser(null);
    }
  }, [loggedIn]);

  const queryThreads = () => {
    getApi("/")
      .then((threads) => {
        console.log("threads", threads);
        setThreads(threads);
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setLoggedIn(true);
      getMe();
      queryThreads();
    } else {
      setLoggedIn(false);
      navigate("/login");
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        loginVisible,
        setLoginVisible,
        user,
        setUser,
        loggedIn,
        setLoggedIn,
        threads,
        localities,
        getMe,
        address,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Step 3: Create a custom hook for other components to use
export const useAppContext = () => {
  return useContext(AppContext);
};
