// SimpleSelect.tsx
import { useState, useCallback } from "react";
import Select from "react-select";
import { ValueType } from "react-select";
import { Option, SimpleProp } from "@/lib/types";

type SelectComponentProps = {
  data: SimpleProp[];
  selectedOptions: number[];
  setSelectedOptions: React.Dispatch<React.SetStateAction<number[]>>;
  isMulti?: boolean;
  placeholder: string;
};

export const SimpleSelect: React.FC<SelectComponentProps> = ({
  data,
  selectedOptions,
  setSelectedOptions,
  isMulti = false,
  placeholder,
}) => {
  const [options, setOptions] = useState<Option[]>(
    data.map((item) => ({ value: item.id, label: item.name })),
  );

  const handleChange = useCallback(
    (selectedOptions: ValueType<Option, boolean>) => {
      if (!selectedOptions) {
        setSelectedOptions([]);
        return;
      }

      if (isMulti && Array.isArray(selectedOptions)) {
        setSelectedOptions(selectedOptions.map((option) => option.value));
      } else {
        setSelectedOptions([selectedOptions?.value || 0]);
      }

      const queryString = isMulti
        ? selectedOptions.map((option) => option.value).join(",")
        : selectedOptions?.value || "";

      const searchParams = new URLSearchParams(window.location.search);
      searchParams.set("vt", queryString);
      window.history.replaceState(
        {},
        "",
        `${window.location.pathname}?${searchParams}`,
      );
    },
    [setSelectedOptions, isMulti],
  );

  return (
    <>
      <Select
        isMulti={isMulti}
        options={options}
        className="createSelect"
        classNamePrefix="create"
        onChange={handleChange}
        isClearable={true}
        value={
          isMulti
            ? options.filter((option) =>
                selectedOptions.some((v) => v === option.value),
              )
            : options.find((option) => option.value === selectedOptions[0]) ||
              null
        }
        placeholder={placeholder}
      />
    </>
  );
};
