import { Plus } from "lucide-react";
import { Button } from "./ui/button";

type EmptyStateProps = {
  objectName?: string;
  onActionClick?: () => void;
  icon?: React.ReactNode;
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  objectName,
  onActionClick,
  icon,
}) => {
  return (
    <div className="col-span-4 flex h-[65vh] w-[full] items-center">
      <div className=" flex h-full w-full items-center justify-center">
        <div className="empty_state flex flex-col items-center">
          {icon}
          <p className="pb-2 text-base font-normal text-[#7f858e]">
            No {objectName?.toLocaleLowerCase()}s found.
          </p>
          <Button onClick={onActionClick}>
            <Plus className="m-0 h-7 w-7 p-0 pr-2" /> Create New {objectName}
          </Button>
        </div>
      </div>
    </div>
  );
};
