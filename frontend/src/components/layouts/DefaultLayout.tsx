import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "@/contexts/ContextProvider";
import { Navbar } from "../Navbar";
import { MenuBar } from "../MenuBar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Toaster } from "@/components/ui/sonner";

export default function DefaultLayout() {
  const { userToken } = useStateContext();

  if (!userToken) {
    return <Navigate to={"/login"} />;
  }

  return (
    <>
      <header>
        <Navbar />
      </header>
      <main className="flex flex-row">
        <aside className="grow-0">
          <MenuBar />
        </aside>
        <ScrollArea className="h-[90.8vh] grow overflow-hidden">
          <div className="ml-9 mr-12 mt-4 pl-0">
            <Outlet />
          </div>
        </ScrollArea>
      </main>
      <Toaster
        richColors={true}
        theme="light"
        position="top-center"
        toastOptions={{ duration: 4500 }}
        closeButton={true}
      />
      <footer></footer>
    </>
  );
}
