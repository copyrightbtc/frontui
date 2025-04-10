import classnames from 'classnames';
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Dropdown } from 'react-bootstrap';
import { ChevronIcon } from '../../assets/images/ChevronIcon';
import { convertToString } from '../../helpers';

type DropdownElem = number | string | React.ReactNode;

export interface DropdownComponentProps {
    list: DropdownElem[];
    iconsList?: React.ReactNode[];
    onSelect?: (index: number) => void;
    className?: string;
    placeholder?: string;
    clear?: boolean;
    selectedValue?: string;
}

export const DropdownComponent = (props: DropdownComponentProps) => {
    const [selected, setSelected] = useState<string | undefined>('');
    const [selectedIcon, setSelectedIcon] = useState<React.ReactNode | undefined>('');

    const { list, className, placeholder, clear, iconsList, onSelect } = props;
    const defaultPlaceholder = list[0];

    const cx = useMemo(() => classnames('base-dropdown', className, {
        'base-dropdown--default': selected === placeholder,
    }), [selected, placeholder, className]);

    useEffect(() => {
        if (clear !== false) {
            setSelected(placeholder || convertToString(defaultPlaceholder));
        }
    }, [placeholder, defaultPlaceholder, clear]);

    useEffect(() => {
        if (typeof props.selectedValue !== 'undefined' && props.selectedValue !== '') {
            setSelected(props.selectedValue);
            iconsList && setSelectedIcon(iconsList[list.indexOf(props.selectedValue)]);
        } else if (props.selectedValue === '') {
            setSelected(placeholder || convertToString(defaultPlaceholder));
            iconsList && setSelectedIcon(iconsList[list.indexOf(props.selectedValue)]);
        }
    }, [iconsList, props.selectedValue]);

    const handleSelect = useCallback((elem: DropdownElem, index: number) => {
        onSelect && onSelect(index);
        setSelected(convertToString(elem));
        iconsList && setSelectedIcon(iconsList[index]);
    }, [iconsList, onSelect]);

    const renderElem = useCallback((elem: DropdownElem, index: number) => {
        return  (
            <Dropdown.Item
                key={index}
                eventKey={index}
            >
                {iconsList ? <div>{iconsList[index]}{elem}</div> : elem}
            </Dropdown.Item>
        );
    }, [iconsList]);

    useEffect(() => {
        if (clear !== false) {
            setSelected(placeholder || convertToString(defaultPlaceholder));
            iconsList && setSelectedIcon(iconsList[list.indexOf(placeholder)]);
        }
    }, [placeholder, iconsList, defaultPlaceholder, clear]);

    const renderSelectedItem = useMemo(() => {
        if (selected) {
            return iconsList ? <div>{selectedIcon}{selected}</div> : selected;
        }

        return placeholder;
    }, [iconsList, selected]);

    return (
        <div className={cx}>
            <Dropdown onSelect={(eventKey) => {
                const element = list.indexOf(eventKey);
                handleSelect(element, parseInt(eventKey));
            }}>
                <Dropdown.Toggle variant="primary" id="dropdown-basic">
                    {renderSelectedItem}
                    <ChevronIcon className="dropdown__arrow" />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    {list.map(renderElem)}
                </Dropdown.Menu>
            </Dropdown>
        </div>
    );
};
