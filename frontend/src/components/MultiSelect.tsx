import { useState, useEffect } from 'react';
import axios from '@/axios';
import CreatableSelect from 'react-select/creatable';

export const SelectComponent = ({ data, onSelect, multi, endpoint }: { data: object[]; onSelect: (value: string[]) => void; multi?: boolean; endpoint: string }) => {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    setOptions(data.map(item => ({ value: item.id, label: item.name })));
  }, [data]);

  const handleSelectChange = async (selectedOptions) => {
    if (multi && Array.isArray(selectedOptions)) {
      const selectedValues = selectedOptions.map(option => option.value);
      onSelect(selectedValues);

      const newOptions = selectedOptions.filter(option => option.__isNew__);

      if (newOptions.length > 0) {
        try {
          // Make an Axios request to create new entities
          const createdOptions = await Promise.all(
            newOptions.map(async newOption => {
              const response = await axios.post(endpoint, { name: newOption.label });
              const newEntity = response.data.data;
              return { value: newEntity.id, label: newEntity.name };
            })
          );

          // Update the local data or perform any necessary actions
          // ...

          // Update the options with the newly created entities
          setOptions(prevOptions => [...prevOptions, ...createdOptions]);

          // Optionally, you can select the newly created options
          onSelect([...selectedValues, ...createdOptions.map(option => option.value)]);
        } catch (error) {
          console.error(`Error creating ${endpoint}:`, error);
          // Handle error as needed
        }
      }
    } else if (!multi && selectedOptions) {
      const selectedValue = selectedOptions.value;
      onSelect([selectedValue]);

      const isNewOption = selectedOptions.__isNew__;

      if (isNewOption) {
        try {
          // Make an Axios request to create a new entity
          const response = await axios.post(endpoint, { name: selectedOptions.label });
          const newEntity = response.data.data;

          // Update the local data or perform any necessary actions
          // ...

          // Update the options with the newly created entity
          setOptions(prevOptions => [...prevOptions, { value: newEntity.id, label: newEntity.name }]);

          // Optionally, you can select the newly created option
          onSelect([newEntity.id]);
        } catch (error) {
          console.error(`Error creating ${endpoint}:`, error);
          // Handle error as needed
        }
      }
    } else {
      onSelect([]);
    }
  };

  return (
    <div className="w-80">
      <CreatableSelect
        isMulti={multi}
        options={options}
        className="createSelect"
        classNamePrefix="create"
        onChange={handleSelectChange}
      />
    </div>
  );
};
