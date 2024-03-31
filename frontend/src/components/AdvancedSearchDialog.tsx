import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SlidersHorizontal } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SimpleSelect } from "./SimpleSelect";
import { useState } from "react";
import { Label } from "./ui/label";
import { AdvancedSearchDialogContent } from "./contexts/AdvancedSearchContext";
import React from "react";

const contentType = [
  { id: 1, name: "Videos", value: "videos" },
  { id: 2, name: "Snippets", value: "snippets" },
  { id: 3, name: "Influencers", value: "influencers" },
  { id: 4, name: "Video Types", value: "video-types" },
  { id: 5, name: "Tags", value: "tags" },
];

const accessibility = [
  { id: 1, name: "Private", value: "private" },
  { id: 2, name: "Public", value: "public" },
];

export const AdvancedSearchDialog = () => {
  const [selectedContentType, setSelectedContentType] = useState<number[]>([]);
  const [selectedAccessibility, setSelectedAccessibility] = useState<number[]>(
    [],
  );

  const [open, setOpen] = React.useState(false);

  const [fetchRequest, setFetchRequest] = useState(false);

  const handleClick = () => {
    setSelectedContentType([1]);
    setSelectedAccessibility([1]);
    setFetchRequest(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger
                onClick={handleClick}
                className="absolute end-0 top-0 h-full rounded-e-full border border-blue-700 bg-blue-700 pl-4 pr-5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                <SlidersHorizontal className="h-5 w-5" />
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Advanced search</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <DialogContent className="min-w-[36vw]">
          <DialogHeader className="flex flex-row gap-5">
            <DialogTitle>Advanced search</DialogTitle>
          </DialogHeader>
          <section className="flex flex-row justify-stretch gap-5">
            <div className="w-full">
              <Label>Accessibility</Label>
              <SimpleSelect
                data={accessibility}
                selectedOptions={selectedAccessibility}
                setSelectedOptions={setSelectedAccessibility}
                placeholder="Select accessibility"
                isCleanable={false}
              />
            </div>

            <div className="w-full">
              <Label>Content type</Label>
              <SimpleSelect
                data={contentType}
                selectedOptions={selectedContentType}
                setSelectedOptions={setSelectedContentType}
                placeholder="Select content type"
                isCleanable={false}
              />
            </div>
          </section>

          {fetchRequest && (
            <AdvancedSearchDialogContent
              selectedContentType={selectedContentType[0]}
              selectedAccessibility={selectedAccessibility[0]}
              contentType={contentType}
              setOpen={setOpen}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
