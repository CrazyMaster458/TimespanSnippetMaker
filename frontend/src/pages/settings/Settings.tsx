import { SettingsMenu } from "@/components/SettingsMenu";
import { UserProvider } from "@/contexts/UserContext";
import { useGetQuery } from "@/services/queries";
import { Outlet } from "react-router-dom";

export default function Settings() {
  const { data: userData, isLoading: areUserDataLoading } = useGetQuery("me");

  return (
    <>
      <UserProvider userData={userData}>
        <div className="flex flex-row gap-5">
          <div className="h-[full] grow-0">
            <SettingsMenu />
          </div>
          <div className="grow overflow-hidden px-3 pb-3">
            {areUserDataLoading ? <p>Loading...</p> : <Outlet />}
          </div>
        </div>
      </UserProvider>
    </>
  );
}
