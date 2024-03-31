import { useStateContext } from "@/contexts/ContextProvider";
import { Navigate, useLocation } from "react-router-dom";

export default function Admin() {
  const { currentUser } = useStateContext();
  const location = useLocation();

  if (currentUser?.admin !== 1) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return (
    <>
      <h1>Admin</h1>
      <div>Hi admin</div>
    </>
  );
}
