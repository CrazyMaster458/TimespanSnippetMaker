/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useCallback } from 'react';
import axios from '@/axios';
import CreatableSelect from 'react-select/creatable';
import { useTagsDataStore, useTagsStore } from '@/utils/StateStore';
import { Tag } from '@/types/type';

interface SelectComponentProps {
  data: Tag[];
  value: number[];
  endpoint: string;
  setValue: (value: Tag[]) => void;
}

interface Option {
  value: number;
  label: string;
}

export const MultiSelect: React.FC<SelectComponentProps> = ({ data, endpoint, value, setValue }) => {
  const [options, setOptions] = useState<Option[]>(data.map((item) => ({ value: item.id, label: item.name })));

  const { addTag } = useTagsDataStore((state) => ({
    addTag: state.addTag,
  }));

  // const { addTag2, setTags } = useTagsStore((state) => ({
  //   addTag2: state.addTag,
  //   setTags: state.setTags,
  // }));

  const handleCreateOption = useCallback(async (inputValue: string) => {
    try {
      const response = await axios.post(endpoint, { name: inputValue });
      const newItem = response.data.data; // Assuming the server response has a 'data' property
      const newOption = { value: newItem.id, label: newItem.name };
      
      // Update options state
      setOptions((currentOptions) => [...currentOptions, newOption]);
      
      // Update value state
      // setValue((currentValue) => [...currentValue, newItem.id]);
      setValue((currentValue) => [...currentValue, newItem.id]);

      // Update data state using setTagsData callback
      // setData((currentData) => [...currentData, { id: newItem.id.toString(), name: newItem.name }]);
      // setTagsData2((currentData) => [...currentData, { id: newItem.id.toString(), name: newItem.name }]);
      // const newItem = { id: 'someId', name: 'someName' };
      addTag(newItem);
    } catch (error) {
      console.error('Error creating the item:', error);
    }
  }, [endpoint]);

  const handleChange = (selectedOptions: Option[] | null) => {
    const selectedValues = selectedOptions ? selectedOptions.map((option) => option.value) : [];
    setValue(selectedValues);
  };

  return (
    <div className="w-full">
      <CreatableSelect
        isMulti
        options={options}
        className="createSelect"
        classNamePrefix="create"
        onChange={handleChange}
        value={options.filter((option) => value.includes(option.value))}
        onCreateOption={handleCreateOption}
      />
    </div>
  );
};
