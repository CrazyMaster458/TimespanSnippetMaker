import { useState, useEffect } from 'react';
import axios from '@/axios';
import CreatableSelect from 'react-select/creatable';

interface SelectComponentProps {
  data: [{id: number, name: string}];
  setValue: (value: Array<number>) => void;
  multi?: boolean;
  endpoint: string;
  value: Array<number>;
  setTagsData: (data: Array<{ id: string; name: string }>) => void;
}

interface Option {
  value: number;
  label: string;
}

// ... (other imports)

export const SelectComponent: React.FC<SelectComponentProps> = ({ data, multi = true, endpoint, value, setValue, setTagsData }) => {
  const [options, setOptions] = useState<Option[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);

  useEffect(() => {
    setOptions(data.map(item => ({ value: item.id, label: item.name })));
    // Set selected options based on the provided IDs
    setSelectedOptions(options.filter(option => value.includes(option.value)));
  }, [data, options, value]);

  const handleCreateOptions = async (newOptions: Option[]) => {
    const createdOptions = await Promise.allSettled(
      newOptions.map(async newOption => {
        try {
          const response = await axios.post(endpoint, { name: newOption.label });
          const newEntity = response.data.data;
          return { value: newEntity.id, label: newEntity.name };
        } catch (error) {
          console.error(`Error creating ${endpoint}:`, error);
          // Handle the error as needed, e.g., show a notification to the user
          return null;
        }
      })
    );

    const successfulOptions = createdOptions
      .filter(result => result.status === 'fulfilled')
      .map(result => result.value);

    // Update options with the new successful options
    setOptions(prevOptions => [...prevOptions, ...successfulOptions]);

    // Update value by merging the existing values with the new ones
    setValue(prevValue => [...prevValue, ...successfulOptions.map(option => option.value)]);

    // Update selected options for display
    setSelectedOptions(prevSelectedOptions => [...prevSelectedOptions, ...successfulOptions]);
    
    // Call setTagsData with the updated tags data
    setTagsData((currentData) => [
      ...currentData,
      ...successfulOptions.map(option => ({ id: option.value, name: option.label }))
    ]);
  };

  const handleSelectChange = async (selectedOptions: Option | Option[]) => {
    if (multi && Array.isArray(selectedOptions)) {
      const selectedValues = selectedOptions.map(option => option.value);
      setValue(selectedValues);

      const newOptions = selectedOptions.filter(option => option.__isNew__) as Option[];

      if (newOptions.length > 0) {
        handleCreateOptions(newOptions);
      }

      // Update selected options for display
      setSelectedOptions(selectedOptions);
    } else if (!multi && selectedOptions) {
      const selectedValue = (selectedOptions as Option).value;
      setValue([selectedValue]);

      const isNewOption = (selectedOptions as Option).__isNew__;

      if (isNewOption) {
        handleCreateOptions([selectedOptions as Option]);
      }

      // Update selected options for display
      setSelectedOptions([selectedOptions as Option]);
    } else {
      setValue([]);
      setSelectedOptions([]);
    }
  };

  return (
    <div className="w-[full]">
      <CreatableSelect
        isMulti={multi}
        options={options}
        className="createSelect"
        classNamePrefix="create"
        onChange={handleSelectChange}
        value={selectedOptions}
      />
    </div>
  );
};

