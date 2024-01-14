"use client"

import * as React from "react"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
]

// ...
// ...
export const ComboboxDemoCopy = ({ label, props, onSelect }: { label: string; props: Array<object>; onSelect: (values: string[]) => void }) => {
  const [open, setOpen] = React.useState(false);
  const [values, setValues] = React.useState<string[]>([]);

  const handleSelect = (value: string) => {
    if (values.includes(value)) {
      setValues(values.filter((v) => v !== value));
    } else {
      setValues([...values, value]);
    }
  };

  const handleBlur = () => {
    setOpen(false);
    onSelect(values);
  };

  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            {values.length > 0
              ? values.map((v) => (typeof v === 'string' ? v.charAt(0).toUpperCase() + v.slice(1) : '')).join(", ")
              : label}
            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput
              placeholder={`Select ${label}`}
              className="h-9"
              onBlur={handleBlur}
            />
            <CommandEmpty>No {label} found.</CommandEmpty>
            <CommandGroup>
              {props.map((prop) => (
                <CommandItem
                  key={prop.id}
                  value={prop.name}
                  onSelect={() => handleSelect(prop.id)}
                >
                  {prop.name}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      values.includes(prop.id) ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
// ...
