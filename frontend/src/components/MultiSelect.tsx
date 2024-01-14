import CreatableSelect from 'react-select/creatable';

export const SelectComponent = ({ data, onSelect, multi }: { data: object[]; onSelect: (value: string[]) => void; multi?: boolean }) => {
  const transformData = data.map(item => ({
    value: item.id,
    label: item.name
  }));

  const handleSelectChange = (selectedOptions) => {
    if (multi && Array.isArray(selectedOptions)) {
      const selectedValues = selectedOptions.map(option => option.value);
      onSelect(selectedValues);
    } else if (!multi && selectedOptions) {
      onSelect([selectedOptions.value]);
    } else {
      onSelect([]);
    }
  };

  return (
    <div className="w-80">
      <CreatableSelect
        isMulti={multi}
        options={transformData}
        className="createSelect"
        classNamePrefix="create"
        onChange={handleSelectChange}
      />
    </div>
  );
};
