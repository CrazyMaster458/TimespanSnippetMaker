import { ReloadIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const LoadingButton = ({ className }: { className?: string }) => {
  return (
    <Button disabled className={cn(className)}>
      <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
      Please wait
    </Button>
  );
};
