import { SettingsMenu } from "@/components/SettingsMenu";
import { Outlet } from "react-router-dom";

export default function Settings() {
  return (
    <>
      <div className="flex flex-row gap-5">
        <div className="h-[full] grow-0 border-2">
          <SettingsMenu />
        </div>
        <div className="grow overflow-hidden  border-2">
          <Outlet />
        </div>
      </div>
    </>
  );
}
