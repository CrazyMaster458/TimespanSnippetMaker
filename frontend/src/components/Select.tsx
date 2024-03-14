import { useState, useCallback, useEffect } from "react";
import CreatableSelect from "react-select/creatable";
// @ts-ignore
import { ValueType } from "react-select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addNewItem, handleSuccess } from "@/api";
import { v4 as uuidv4 } from "uuid";
import { Option, SimpleProp } from "@/types/types";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/getErrorMessage";

type SelectComponentProps = {
  data: SimpleProp[];
  selectedOptions: Option[];
  setSelectedOptions: React.Dispatch<React.SetStateAction<Option[]>>;
  endpoint: string;
  isMulti?: boolean;
  placeholder: string;
};

export const Select: React.FC<SelectComponentProps> = ({
  data,
  endpoint,
  selectedOptions,
  setSelectedOptions,
  isMulti = false,
  placeholder,
}) => {
  const [options, setOptions] = useState<Option[]>(
    data.map((item) => ({ value: item.id, label: item.name })),
  );

  useEffect(() => {
    console.log(selectedOptions);
  }, [selectedOptions]);

  const removeLastItem = (array: Option[], item: SimpleProp) => {
    if (array.length > 0 && array[array.length - 1].label === item.name) {
      return array.slice(0, -1);
    }
    return array;
  };

  const updateOptionsAndSelected = (newOption: Option) => {
    setOptions((currentOptions) => [...currentOptions, newOption]);
    {
      isMulti
        ? setSelectedOptions((currentValue) => [...currentValue, newOption])
        : setSelectedOptions([newOption]);
    }
  };

  const queryClient = useQueryClient();

  const { mutateAsync: optimisticUpdate } = useMutation({
    mutationFn: addNewItem,
    onSuccess: async (newItem) => {
      await handleSuccess({ queryClient, endpoint, newItem });

      setOptions(removeLastItem(options, newItem));
      setSelectedOptions(removeLastItem(selectedOptions, newItem));
    },
    onMutate: async (newItem) => {
      const { endpoint, inputValue } = newItem;
      await queryClient.cancelQueries([endpoint]);
      const previousData = queryClient.getQueryData<Option[]>([endpoint]);

      const newOption: Option = { value: uuidv4(), label: inputValue };

      queryClient.setQueryData<Option[]>([endpoint], (prevData) => [
        ...prevData,
        newOption,
      ]);

      updateOptionsAndSelected(newOption);

      return { previousData, endpoint };
    },
    onError: (error, context) => {
      const { endpoint } = context;
      queryClient.setQueryData([endpoint], context.previousData);
    },
    onSettled: () => {
      queryClient.invalidateQueries([endpoint]);
    },
  });

  const handleCreateOption = useCallback(
    async (inputValue: string) => {
      try {
        const newItem = await optimisticUpdate({ endpoint, inputValue });
        const newOption = { value: newItem.id, label: newItem.name };

        updateOptionsAndSelected(newOption);
      } catch (error) {
        console.error("Error creating the item:", error);
        toast.error(getErrorMessage(error));
      }
    },
    [optimisticUpdate, endpoint, isMulti],
  );

  const handleChange = useCallback(
    async (selectedOptions: ValueType<Option, boolean>) => {
      if (!selectedOptions) {
        setSelectedOptions([]);
        return;
      }

      if (isMulti && Array.isArray(selectedOptions)) {
        setSelectedOptions([...selectedOptions]);
      } else {
        setSelectedOptions([selectedOptions]);
      }
    },
    [setSelectedOptions],
  );

  return (
    <>
      <CreatableSelect
        isMulti={isMulti}
        options={options}
        className="createSelect"
        classNamePrefix="create"
        onChange={handleChange}
        isClearable={true}
        value={
          isMulti
            ? options.filter((option) =>
                selectedOptions.some((v) => v.value === option.value),
              )
            : options.find(
                (option) => option.value === selectedOptions[0]?.value,
              ) || null
        }
        onCreateOption={handleCreateOption}
        placeholder={placeholder}
      />
    </>
  );
};
