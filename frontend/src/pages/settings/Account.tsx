import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export const Account = () => {
    return (
        <div className="px-3 pb-3">
            <div className="text-2xl font-semibold pb-5">Account Settings</div>

            <div>
                <form action="" className="flex flex-col gap-3">
                    <div className="">
                        <Label htmlFor="username">Username</Label>
                        <Input type="text" id="username" placeholder="Username" />
                    </div>

                    <div className="">
                        <Label htmlFor="email">Email</Label>
                        <Input type="email" id="email" placeholder="Email" />
                    </div>

                    <div>
                        <Button>Save changes</Button>
                    </div>
                </form>
            </div>

            <div className="">
                <form action="" className="flex flex-col gap-3 pb-3">
                    <div className="">
                        <Label htmlFor="curr_password">Current password</Label>
                        <Input type="password" id="curr_password" placeholder="Current password" />
                    </div>

                    <div className="">
                        <Label htmlFor="new_password">New password</Label>
                        <Input type="password" id="new_password" placeholder="New password" />
                    </div>

                    <div className="">
                        <Label htmlFor="conf_password">Confirm password</Label>
                        <Input type="password" id="conf_password" placeholder="Confirm password" />
                    </div>

                    <div>
                        <Button>Save password</Button>
                    </div>
                </form>
            </div>

            <div>
                <div>
                    <Button variant="destructive">Delete account</Button>
                </div>
            </div>
        </div>
    );
};