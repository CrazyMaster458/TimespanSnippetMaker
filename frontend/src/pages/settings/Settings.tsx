import { MenuBar2 } from "@/components/MenuBar2";
import { Outlet } from "react-router-dom";

export default function Settings() {
    return (
        <>
            <div className="flex flex-row gap-5">
                <div className="grow-0 h-[full] border-2">
                    <MenuBar2/>
                </div>
                <div className="grow overflow-hidden  border-2">
                    <Outlet />
                </div>
            </div>
        </>
    );
}