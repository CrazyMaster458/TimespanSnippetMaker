import { useStateContext } from "@/contexts/ContextProvider";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function GuestLayout() {
  const { userToken } = useStateContext();

  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  if (userToken) {
    return <Navigate to={from} replace={true} />;
  }

  return (
    <main className="flex h-screen w-screen items-center justify-center">
      <Outlet />
    </main>
  );
}
