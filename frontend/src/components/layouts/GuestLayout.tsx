import { useStateContext } from "@/contexts/ContextProvider";
import { Navigate, Outlet } from "react-router-dom";

export default function GuestLayout() {
  const { userToken } = useStateContext();

  if (userToken) {
    return <Navigate to={"/"} />;
  }

  return (
    <div>
      <Outlet />
    </div>
  );
}
