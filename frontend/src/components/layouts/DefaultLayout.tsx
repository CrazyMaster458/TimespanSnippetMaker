import { Navigate, Outlet } from "react-router-dom";
import { Navbar } from "../Navbar";
import { useStateContext } from "@/contexts/ContextProvider";
import axiosClient from "@/axios";

export default function DefaultLayout() {
  const { userToken, setCurrentUser, setUserToken } = useStateContext();

  if (!userToken) {
    return <Navigate to={"login"} />;
  }

  const logout = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    axiosClient.post("/logout").then(() => {
      setCurrentUser({});
      setUserToken(null);
    });
  };

  return (
    <div>
      <button onClick={logout}>Logout</button>

      <Navbar />
      <div>
        <Outlet />
      </div>
    </div>
  );
}
