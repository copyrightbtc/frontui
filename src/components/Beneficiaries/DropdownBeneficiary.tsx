import classnames from 'classnames';
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Dropdown } from 'react-bootstrap';
import { ChevronIcon } from '../../assets/images/ChevronIcon';
import { convertToString } from '../../helpers';
import { BeneficiariesBlockchainItemProps } from './BeneficiariesCrypto/BeneficiariesBlockchainItem';
import { selectUserIsMember } from '../../modules';

type DropdownElem = number | string | React.ReactNode;

export interface DropdownBeneficiaryProps {
    list: DropdownElem[] | any;
    onSelect?: (index: number) => void;
    className?: string,
    placeholder?: string;
    clear?: boolean;
    selectedValue?: BeneficiariesBlockchainItemProps;
}

const defaultSelected = {
    blockchainKey: '',
    protocol: '',
    name: '',
    id: '',
    fee: '',
    minWithdraw: '',
}


export const DropdownBeneficiary = (props: DropdownBeneficiaryProps) => {
    const isMember: boolean = useSelector(selectUserIsMember);
    const [selected, setSelected] = useState<BeneficiariesBlockchainItemProps | undefined>(defaultSelected);

    const { list, className, placeholder, clear, onSelect } = props;
    const defaultPlaceholder = list[0];

    const cx = useMemo(() => classnames('base-dropdown undelines', className, {
        'base-dropdown--default': defaultSelected.protocol === placeholder,
    }), [selected, placeholder, className]);

    useEffect(() => {
        if (clear !== false) {
            setSelected(placeholder || convertToString(defaultPlaceholder));
        }
    }, [placeholder, defaultPlaceholder, clear]);

    useEffect(() => {
        if (typeof props.selectedValue !== 'undefined' && props.selectedValue.id !== '') {
            setSelected(props.selectedValue);
        } else if (props.selectedValue.id === '') {
            setSelected(placeholder || convertToString(defaultPlaceholder));
        }
    }, [props.selectedValue]);

    const handleSelect = useCallback((elem: DropdownElem | any, index: number) => {
        if (elem.props?.disabled) {
            return;
        }

        onSelect && onSelect(index);
        setSelected(elem.props);
    }, []);

    const renderElem = useCallback((elem: DropdownElem | any, index: number) => {
        // @ts-ignore
        if (elem?.props?.isHidden && isMember) {
            return null;
        }

        return  (
            <Dropdown.Item
                key={index}
                disabled={elem?.props?.disabled}
            >
                <div>{elem}</div>
            </Dropdown.Item>
        );
    }, []);

    const renderSelectedItem = useMemo(() => {
        if (selected.name && selected.id) {
            return <div><span>{selected.protocol?.toUpperCase()}</span> {selected.name} ({selected.id.toUpperCase()})</div>;
        }

        return placeholder;
    }, [selected]);

    return (
        <div className={cx}>
            <Dropdown onSelect={(none, event) => {
                const element = event.currentTarget as HTMLElement;
                const firstDepthDiv = element.children[0]
                const secondDepthDiv = firstDepthDiv?.children[0]
                const protocol = secondDepthDiv.getAttribute('data-id');

                const selected_element = list.find((elem: { props: { protocol: string; }; }) => elem.props.protocol === protocol);
                const index = list.indexOf(selected_element);

                handleSelect(selected_element, index);
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
