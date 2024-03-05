import { useState, useCallback } from 'react';
import axios from '@/axios';
import CreatableSelect from 'react-select/creatable';

interface SelectComponentProps {
  data: { id: number; name: string }[];
  setValue: (value: number[]) => void;
  value: number[];
  endpoint: string;
  setTagsData: (tagsData: { id: string; name: string }[]) => void;
}

interface Option {
  value: number;
  label: string;
}

export const SelectComponent2: React.FC<SelectComponentProps> = ({ data, endpoint, value, setValue, setTagsData }) => {
  const [options, setOptions] = useState<Option[]>(data.map((item) => ({ value: item.id, label: item.name })));

  const handleCreateOption = useCallback(async (inputValue: string) => {
    try {
      const response = await axios.post(endpoint, { name: inputValue });
      const newItem = response.data.data; // Assuming the server response has a 'data' property
      const newOption = { value: newItem.id, label: newItem.name };
      
      // Update options state
      setOptions((currentOptions) => [...currentOptions, newOption]);
      
      // Update value state
      setValue((currentValue) => [...currentValue, newItem.id]);

      // Update data state using setTagsData callback
      setTagsData((currentData) => [...currentData, { id: newItem.id.toString(), name: newItem.name }]);
    } catch (error) {
      console.error('Error creating the item:', error);
    }
  }, [endpoint, setValue, setTagsData]);

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
