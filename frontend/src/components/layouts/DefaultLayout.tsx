import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "@/contexts/ContextProvider";
import { Navbar2 } from "../Navbar2";

export default function DefaultLayout() {
  const { userToken } = useStateContext();

  if (!userToken) {
    return <Navigate to={"login"} />;
  }

  return (
    <div>
      <Navbar2 />
      <div>
        <Outlet />
      </div>
    </div>
  );
}
