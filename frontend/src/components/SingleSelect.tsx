import { useState, useCallback } from 'react';
import axios from '@/axios';
import CreatableSelect from 'react-select/creatable';

interface SelectComponentProps {
  data: { id: number; name: string }[];
  setValue: (value: number | null) => void; // Now expects a single value or null
  value: number | null; // Single selected value or null if nothing is selected
  endpoint: string;
  setData: (data: { id: string; name: string }[]) => void;
}

interface Option {
  value: number;
  label: string;
}

export const SingleSelect: React.FC<SelectComponentProps> = ({
  data,
  endpoint,
  value,
  setValue,
  setData,
}) => {
  const [options, setOptions] = useState<Option[]>(
    data.map((item) => ({ value: item.id, label: item.name }))
  );

  const handleCreateOption = useCallback(
    async (inputValue: string) => {
      try {
        const response = await axios.post(endpoint, { name: inputValue });
        const newItem = response.data.data; // Assuming the server response has a 'data' property
        const newOption = { value: newItem.id, label: newItem.name };

        // Update options state
        setOptions((currentOptions) => [...currentOptions, newOption]);

        // Update value state to the new item's id
        setValue(newItem.id);

        // Update data state using setData callback
        setData((currentData) => [...currentData, { id: newItem.id.toString(), name: newItem.name }]);
      } catch (error) {
        console.error('Error creating the item:', error);
      }
    },
    [endpoint, setValue, setData]
  );

  const handleChange = (selectedOption: Option | null) => {
    setValue(selectedOption ? selectedOption.value : null);
  };

  return (
    <div className="w-full">
      <CreatableSelect
        options={options}
        className="createSelect"
        classNamePrefix="create"
        onChange={handleChange}
        value={options.find((option) => option.value === value) || null} // Find the option that matches the current value or null if not found
        onCreateOption={handleCreateOption}
      />
    </div>
  );
};
