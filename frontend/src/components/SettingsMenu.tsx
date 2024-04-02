import { Link } from "react-router-dom";
import { User } from "lucide-react";
import { Settings2 } from "lucide-react";
import { LogOut } from "lucide-react";
import axiosClient from "@/services/axios";
import { useQueryClient } from "@tanstack/react-query";

export const SettingsMenu = () => {
  const queryClient = useQueryClient();

  const logout = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    axiosClient.post("/logout").then(() => {
      queryClient.removeQueries();
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    });
  };

  return (
    <ul className="menu w-56 rounded-box">
      <li>
        <Link to="/settings/account" data-tip="Account">
          <User className=" h-5 w-5" viewBox="0 0 24 24" /> Account
        </Link>
      </li>
      <li>
        <Link to="/settings/preferences" data-tip="Preferences">
          <Settings2 className=" h-5 w-5" viewBox="0 0 24 24" /> Preferences
        </Link>
      </li>
      <li>
        <Link onClick={logout} data-tip="Logout" to={""}>
          <LogOut className=" h-5 w-5" viewBox="0 0 24 24" /> Log out
        </Link>
      </li>
    </ul>
  );
};
