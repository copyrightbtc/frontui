import * as React from 'react';
import Select, { ValueType } from 'react-select';

export interface OptionsInterface {
    label: string;
    value: string;
}

interface OwnProps {
    options?: OptionsInterface[];
    onSelect: (option: ValueType<OptionsInterface, false>) => void;
    placeholder: string;
    className?: string;
    classNamePrefix?: string;
    isClearable?: boolean;
    isSearchable?: boolean;
    maxMenuHeight?: number;
    value?: OptionsInterface;
}
 
export const SearchDropdown: React.FC<OwnProps> = ({ 
    className, 
    onSelect, 
    options, 
    placeholder, 
    classNamePrefix, 
    maxMenuHeight, 
    isClearable, 
    isSearchable, 
    value 
}) => (

    <Select
        className={className}
        classNamePrefix={classNamePrefix || 'search-dropdown'}
        options={options}
        onChange={onSelect}
        placeholder={placeholder}
        maxMenuHeight={maxMenuHeight}
        isClearable={isClearable}
        isSearchable={isSearchable}
        value={value}
        noOptionsMessage={() => "No results found"}
    />
);