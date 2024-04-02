import { useState, useCallback } from "react";
import CreatableSelect from "react-select/creatable";
// @ts-ignore
import { ValueType } from "react-select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addNewItem, handleSuccess } from "@/services/api";
import { v4 as uuidv4 } from "uuid";
import { BasicProp, Option } from "@/lib/types";
import { Schema } from "zod";

type SelectComponentProps = {
  data: BasicProp[];
  selectedOptions: Option[];
  setSelectedOptions: React.Dispatch<React.SetStateAction<Option[]>>;
  endpoint: string;
  isMulti?: boolean;
  placeholder: string;
  schema: Schema;
  isEditable?: boolean;
};

export const CreateSelect: React.FC<SelectComponentProps> = ({
  data,
  endpoint,
  selectedOptions,
  setSelectedOptions,
  isMulti = false,
  placeholder,
  schema,
  isEditable = true,
}) => {
  const [options, setOptions] = useState<Option[]>(
    data.map((item) => ({ value: item.id, label: item.name })),
  );

  const removeLastItem = (array: Option[], item: BasicProp) => {
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
      await handleSuccess({ queryClient, queryName: [endpoint], newItem });

      setOptions(removeLastItem(options, newItem));
      setSelectedOptions(removeLastItem(selectedOptions, newItem));
    },
    onMutate: async (newItem) => {
      const { endpoint, data } = newItem;
      const queryName = [endpoint];
      await queryClient.cancelQueries({ queryKey: queryName });
      const previousData = queryClient.getQueryData<Option[]>([queryName]);

      //@ts-ignore
      const newOption: Option = { value: uuidv4(), label: data.name };

      queryClient.setQueryData<Option[]>(queryName, (prevData: any) => [
        ...prevData,
        newOption,
      ]);

      updateOptionsAndSelected(newOption);

      return { previousData, queryName, data };
    },
    onError: (error, context) => {
      const { endpoint: queryName, data } = context;
      //@ts-ignore
      queryClient.setQueryData([queryName], context.previousData);
      //@ts-ignore
      setOptions(removeLastItem(options, data));
      //@ts-ignore
      setSelectedOptions(removeLastItem(selectedOptions, data));
      console.log("Error creating the item:", error);
    },
    onSettled: () => {
      const queryName = [endpoint];
      queryClient.invalidateQueries({ queryKey: queryName });
    },
  });

  const handleCreateOption = useCallback(
    async (inputValue: string) => {
      try {
        const data = { name: inputValue };
        const newItem = await optimisticUpdate({ endpoint, data, schema });
        const newOption = { value: newItem.id, label: newItem.name };

        updateOptionsAndSelected(newOption);
      } catch (error) {
        console.error("Error creating the item:", error);
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
        isDisabled={!isEditable}
      />
    </>
  );
};
