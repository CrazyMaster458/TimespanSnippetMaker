import CreatableSelect from 'react-select/creatable';

export const SelectComponent2 = ({ data, onSelect, multi }: { data: object[]; onSelect: (value: string[]) => void; multi?: boolean }) => {
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
    <div className="w-80 mb-0 pb-0">
      <CreatableSelect
        isMulti={multi}
        isSearchable={false} // Set to false to disable free text input
        options={transformData}
        className="createSelect"
        classNamePrefix="create"
        onChange={handleSelectChange}
      />
    </div>
  );
};
