import { Outlet } from "react-router-dom";

export default function GuestLayout() {
  return (
    <div>
      <p>Part of a layout</p>
      <Outlet />
    </div>
  );
}
