import { useStateContext } from "@/contexts/ContextProvider";
import axiosClient from "@/api/axios";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Video } from "lucide-react";
import { UploadFileDialog } from "./UploadFileDialog";

export const Navbar = () => {
  const { setCurrentUser, setUserToken } = useStateContext();

  const toggleDrawer = () => {
    const drawerCheckbox = document.getElementById(
      "my-drawer",
    ) as HTMLInputElement;
    if (drawerCheckbox) {
      drawerCheckbox.checked = !drawerCheckbox.checked;
    }
  };

  const logout = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    axiosClient.post("/logout").then(() => {
      setCurrentUser({});
      setUserToken(null);
    });
  };

  return (
    <nav style={{ position: "relative", zIndex: 2 }}>
      <div className="h-1rem navbar border-b-4 bg-base-100 p-0 px-2">
        <div className="navbar-start">
          <div className="dropdown">
            <button
              tabIndex={0}
              role="button"
              className="btn btn-circle btn-ghost"
              onClick={toggleDrawer}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h7"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="navbar-center"></div>
        <div className="navbar-end">
          <UploadFileDialog />
          <button className="btn btn-circle btn-ghost">
            <div className="indicator">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <span className="badge indicator-item badge-primary badge-xs"></span>
            </div>
          </button>
        </div>
      </div>
      <div className="drawer">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">{/* Page content here */}</div>
        <div className="drawer-side mt-16">
          <label
            htmlFor="my-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="w-65 menu flex min-h-full flex-col bg-base-100 p-4 text-base-content">
            {/* Sidebar content here */}
            <li className="w-56">
              <Link to={"/listview"}>
                <Video />
                ListView
              </Link>
            </li>
            <li className="w-56">
              <a>Sidebar Item 2</a>
            </li>
            <Button
              variant="outline"
              className="justify-self-end bg-red-500"
              onClick={logout}
            >
              Logout
            </Button>
          </ul>
        </div>
      </div>
    </nav>
  );
};
