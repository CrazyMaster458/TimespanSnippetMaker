/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ReactNode,
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
} from "react";

interface User {
  username: string;
  email: string;
}

interface ContextType {
  currentUser: User;
  userToken: string | null;
  setCurrentUser: Dispatch<SetStateAction<User>>;
  setUserToken: Dispatch<SetStateAction<string | null>>;
}

const defaultContext: ContextType = {
  currentUser: {
    username: "",
    email: "",
  },
  userToken: null,
  setCurrentUser: () => {},
  setUserToken: () => {},
};

const StateContext = createContext(defaultContext);

export const ContextProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User>({
    username: "",
    email: "",
  });
  const [userToken, _setUserToken] = useState<string | null>(
    localStorage.getItem("TOKEN") || ""
  );

  const setUserToken = (token: any) => {
    if (token) {
      localStorage.setItem("TOKEN", token);
    } else {
      localStorage.removeItem("TOKEN");
    }
    _setUserToken(token);
  };

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
