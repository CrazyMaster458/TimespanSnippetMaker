/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ReactNode,
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";

interface User {
  id: number;
  username: string;
  admin: number;
}

interface ContextType {
  currentUser: User | null;
  userToken: string | null;
  setCurrentUser: Dispatch<SetStateAction<User | null>>;
  setUserToken: Dispatch<SetStateAction<string | null>>;
}

const defaultContext: ContextType = {
  currentUser: null,
  userToken: null,
  setCurrentUser: () => {},
  setUserToken: () => {},
};

const StateContext = createContext(defaultContext);

export const ContextProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, _setCurrentUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("USER");
    if (storedUser) {
      return JSON.parse(storedUser);
    } else {
      return null;
    }
  });
  const [userToken, _setUserToken] = useState<string | null>(
    localStorage.getItem("TOKEN") || null,
  );

  useEffect(() => {
    const handleStorageChange = () => {
      const storedUser = localStorage.getItem("USER");
      const storedToken = localStorage.getItem("TOKEN");
      _setCurrentUser(storedUser ? JSON.parse(storedUser) : null);
      _setUserToken(storedToken);
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const setUserToken = (token: any) => {
    if (token) {
      localStorage.setItem("TOKEN", token);
    } else {
      localStorage.removeItem("TOKEN");
    }
    _setUserToken(token);
  };

  const setCurrentUser = (user: any) => {
    if (user) {
      localStorage.setItem("USER", JSON.stringify(user));
    } else {
      localStorage.removeItem("USER");
    }
    _setCurrentUser(user);
  };

  useEffect(() => {
    _setCurrentUser(JSON.parse(localStorage.getItem("USER") || "null"));
    _setUserToken(localStorage.getItem("TOKEN"));
  }, []);

  return (
    <StateContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        userToken,
        setUserToken,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
