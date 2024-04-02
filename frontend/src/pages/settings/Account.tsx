import { SelfDeleteDialog } from "@/components/SelfDeleteDialog";
import { useUserContext } from "@/contexts/UserContext";

export const Account = () => {
  const userData = useUserContext();

  return (
    <section>
      <h2 className="pb-6 text-2xl font-semibold">Account Settings</h2>
      <SelfDeleteDialog endpoint={"user"} itemData={userData} />
    </section>
  );
};
