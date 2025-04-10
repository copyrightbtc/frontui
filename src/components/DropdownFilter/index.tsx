import React, { ReactNode } from 'react';
import Select, { ValueType } from 'react-select';

export interface OptionsInterfaceFilter {
    label: string;
    value: string;
}

interface DropdownFilterProps {
    options?: OptionsInterfaceFilter[];
    onSelect: (option: ValueType<OptionsInterfaceFilter, false>) => void;
    placeholder?: string;
    className?: string;
    classNamePrefix?: string;
    isClearable?: boolean;
    isSearchable?: boolean;
    maxMenuHeight?: number;
    value?: OptionsInterfaceFilter;
    defaultValue?: ReactNode;
    suffix?: ReactNode,
    fixedWidth?: number;
    emptyTitle?: string;
}


class DropdownFilter extends React.Component<DropdownFilterProps>{
    public render() {

        const {
            suffix, 
            className, 
            onSelect,
            options,
            placeholder,
            classNamePrefix, 
            maxMenuHeight, 
            isClearable, 
            isSearchable,
            defaultValue,
            value,
            fixedWidth,
            emptyTitle
        } = this.props;

        const Icon = ({ innerRef, innerProps }) => (
            <svg stroke-linejoin="round" stroke-miterlimit="2" width="24" height="24" xmlns="http://www.w3.org/2000/svg" className="dropdown-icon" ref={innerRef} {...innerProps}>
                <path d="m16.843 10.211c.108-.141.157-.3.157-.456 0-.389-.306-.755-.749-.755h-8.501c-.445 0-.75.367-.75.755 0 .157.05.316.159.457 1.203 1.554 3.252 4.199 4.258 5.498.142.184.36.29.592.29.23 0 .449-.107.591-.291 1.002-1.299 3.044-3.945 4.243-5.498z"/>
            </svg>
        );
        const components = {
          DropdownIndicator: Icon,
        };
        
        const suffixMarkup = suffix ? <div className="filter-options__suffix">{suffix}</div> : null;
        return (
            <div className="filter-options" style={{ minWidth: fixedWidth ? `${fixedWidth}px` : undefined, width: fixedWidth ? `${fixedWidth}px` : undefined }}>
                {suffixMarkup}
                <Select
                    className={className || 'filter-options__dropdown'}
                    classNamePrefix={classNamePrefix || 'filter-options__dropdown__prefix'}
                    options={options}
                    onChange={onSelect}
                    placeholder={placeholder}
                    maxMenuHeight={maxMenuHeight}
                    isClearable={isClearable}
                    isSearchable={isSearchable}
                    value={value}
                    noOptionsMessage={() => emptyTitle || "Options are empty"}
                    components={components}
                    defaultValue={defaultValue}
                />
            </div>
        );
    };
};

export {
    DropdownFilter,
};
