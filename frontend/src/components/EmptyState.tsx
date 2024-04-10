import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { LoadingButton } from "./LoadingButton";

type EmptyStateProps = {
  objectName?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  button?: React.ReactNode;
  isPending?: boolean;
  showButton?: boolean;
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  objectName,
  onClick,
  icon,
  button,
  isPending = false,
  showButton = true,
}) => {
  return (
    <section className="col-span-4 flex h-[65vh] w-[full] items-center">
      <div className=" flex h-full w-full items-center justify-center">
        <div className="empty_state flex flex-col items-center">
          {icon}
          <p className="pb-2 text-base font-normal text-[#7f858e]">
            {`No ${objectName?.toLocaleLowerCase()}s found`}
          </p>
          {isPending ? (
            <>
              <LoadingButton />
            </>
          ) : (
            showButton &&
            (button ? (
              button
            ) : (
              <Button onClick={onClick}>
                <Plus className="m-0 h-7 w-7 p-0 pr-2" />
                {`Create New ${objectName}`}
              </Button>
            ))
          )}
        </div>
      </div>
    </section>
  );
};
