import { useCallback } from "react";
import Select from "react-select";
//@ts-ignore
import { ValueType } from "react-select";
import { Option, BasicProp } from "@/lib/types";

type SelectComponentProps = {
  data: BasicProp[];
  selectedOptions: number[];
  setSelectedOptions: React.Dispatch<React.SetStateAction<number[]>>;
  isMulti?: boolean;
  placeholder: string;
  isCleanable?: boolean;
};

export const SimpleSelect: React.FC<SelectComponentProps> = ({
  data,
  selectedOptions,
  setSelectedOptions,
  isMulti = false,
  placeholder,
  isCleanable = true,
}) => {
  const options: Option[] = data.map((item) => ({
    value: item.id,
    label: item.name,
  }));

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
        ? selectedOptions.map((option: Option) => option.value).join(",")
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
        classNamePrefix="create"
        onChange={handleChange}
        isClearable={isCleanable}
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
