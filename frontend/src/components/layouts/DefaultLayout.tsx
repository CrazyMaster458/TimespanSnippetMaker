import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "@/contexts/ContextProvider";
import { Navbar2 } from "../Navbar2";
import { MenuBar } from "../MenuBar";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function DefaultLayout() {
  const { userToken } = useStateContext();

  if (!userToken) {
    return <Navigate to={"login"} />;
  }

  return (
    <div>
      <Navbar2 />
      <div className="flex flex-row">
        <div className="grow-0">
          <MenuBar />
        </div>
        <ScrollArea className="grow overflow-hidden h-[90.8vh]">
          <div className="ml-8 mr-12 pl-0 mt-4">
            <Outlet />
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
