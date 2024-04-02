import { createContext, useContext } from "react";

const UserContext = createContext(null);

export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({
  userData,
  children,
}: {
  userData: any;
  children: any;
}) => {
  return (
    <UserContext.Provider value={userData}>{children}</UserContext.Provider>
  );
};
