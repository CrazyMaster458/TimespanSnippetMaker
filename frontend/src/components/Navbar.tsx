// ... (your imports)
import { useStateContext } from "@/contexts/ContextProvider";
import axiosClient from "@/axios";
import { Link, Navigate } from "react-router-dom";
import { Button } from "./ui/button";
import { SearchBar } from "./SearchBar";
import { Video } from "lucide-react";

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
          {/* <div className="text-sm breadcrumbs">
              <ul>
                <li><a>Home</a></li> 
                <li><a>Documents</a></li> 
                <li>Add Document</li>
              </ul>
            </div> */}
        </div>
        <div className="navbar-center"></div>
        <div className="navbar-end">
          <button className="btn btn-circle btn-ghost">
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
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
            {/* <ul className="menu bg-base-200 w-56 rounded-box">
                <li>
                    <a>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                    Item 2
                    </a>
                </li>
                <li>
                    <a>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Item 1
                    </a>
                </li>
                <li>
                    <a>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                    Item 3
                    </a>
                </li>
                </ul> */}
            {/* <ul className="menu bg-base-200 w-56 rounded-box">
                <li><a>Item 1</a></li>
                <li>
                    <details open>
                    <summary>Parent</summary>
                    <ul>
                        <li><a>Submenu 1</a></li>
                        <li><a>Submenu 2</a></li>
                        <li>
                        <details open>
                            <summary>Parent</summary>
                            <ul>
                            <li><a>Submenu 1</a></li>
                            <li><a>Submenu 2</a></li>
                            </ul>
                        </details>
                        </li>
                    </ul>
                    </details>
                </li>
                <li><a>Item 3</a></li>
                </ul> */}
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
