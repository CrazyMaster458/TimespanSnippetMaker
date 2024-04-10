import { useUserContext } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { meSchema } from "@/lib/types";
import { useUpdateMutation } from "@/services/mutations";
import { LoadingButton } from "@/components/LoadingButton";
import { useStateContext } from "@/contexts/ContextProvider";

export const Preferences = () => {
  const userData = useUserContext() as any;
  const { setCurrentUser } = useStateContext();
  const userUpdate = useUpdateMutation("users", meSchema);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (userData) {
      const updatedUserData = { ...userData, fast_cut: cuttingMode ? 1 : 0 };

      await userUpdate.mutateAsync(updatedUserData);

      if (userUpdate.data) {
        setCurrentUser(userUpdate.data.data);
      }
    }
  };

  const [cuttingMode, setCuttingMode] = useState(
    //@ts-ignore
    userData?.fast_cut === 1,
  );

  const handleCheckboxChange = (isChecked: boolean) => {
    setCuttingMode(isChecked);
  };

  return (
    <>
      <h2 className="pb-6 text-2xl font-semibold">Preferences</h2>

      <form onSubmit={(e) => handleSubmit(e)}>
        <div className="items-top flex space-x-2 pb-4">
          <Checkbox
            id="cuttingMode"
            checked={cuttingMode}
            onCheckedChange={handleCheckboxChange}
          />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="cuttingMode"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Turn on fast cutting
            </label>
            <p className="text-sm text-muted-foreground">
              Videos will be cut faster but with a small defect at the beginning
              of a video
            </p>
          </div>
        </div>
        {userUpdate.isPending ? (
          <LoadingButton />
        ) : (
          <Button type="submit">Save</Button>
        )}
      </form>
    </>
  );
};
