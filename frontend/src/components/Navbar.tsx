import { useStateContext } from "@/contexts/ContextProvider";
import axiosClient from "@/services/axios";
import { Button } from "./ui/button";
import { Menu, LogOut } from "lucide-react";
import { VideoCreationDialog } from "./VideoCreationDialog";
import { useQueryClient } from "@tanstack/react-query";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LoggedUser } from "@/lib/types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MenuBar } from "./MenuBar";
import { SearchBar } from "./SearchBar";

export const Navbar = ({ user }: { user?: LoggedUser | null }) => {
  const { setCurrentUser, setUserToken } = useStateContext();
  const queryClient = useQueryClient();

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
      queryClient.removeQueries();
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setCurrentUser(null);
      setUserToken(null);
      window.location.href = "/login";
    });
  };

  return (
    <nav style={{ position: "relative", zIndex: 2 }}>
      <div className="h-1rem navbar border-b-4 bg-base-100 p-0 pl-2.5 pr-4">
        <div className="navbar-start">
          <div className="dropdown">
            <button
              tabIndex={0}
              role="button"
              className="btn btn-circle btn-ghost"
              onClick={toggleDrawer}
            >
              <Menu />
            </button>
          </div>
        </div>
        <div className="navbar-center w-[32rem]">
          <SearchBar />
        </div>
        <div className="navbar-end gap-2">
          <VideoCreationDialog />
          <Popover>
            <button className="btn btn-circle btn-ghost">
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger>
                    <PopoverTrigger>
                      <Avatar>
                        <AvatarFallback>
                          {user?.username[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </PopoverTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{user?.username}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </button>
            <PopoverContent className="w-48 p-0">
              <Button
                variant="ghost"
                className="flex w-full flex-row gap-2"
                onClick={logout}
              >
                <LogOut size={20} /> Log out
              </Button>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="drawer">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-side mt-16">
          <label
            htmlFor="my-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="w-65 menu m-0 bg-base-100 p-0">
            <MenuBar isAdmin={user?.admin || 0} />
          </ul>
        </div>
      </div>
    </nav>
  );
};
