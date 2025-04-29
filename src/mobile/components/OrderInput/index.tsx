import cr from 'classnames';
import React, { ReactNode } from 'react';
import { InputOrders } from 'src/components/OrderInput/InputOrders';
import { areEqualProps} from '../../../helpers/areEqualProps';

/* Icons */
import { MinusIcon } from '../../assets/images/MinusIcon';
import { PlusIcon } from '../../assets/images/PlusIcon';

export interface OrderInputProps {
    className?: string;
    isFocused: boolean;
    isWrong?: boolean;
    currency?: string;
    autoFocus?: boolean;
    fixedLabel?: string;
    placeholder?: string;
    label?: string;
    value: string | number;
    precision: number;
    handleChangeValue: (text: string) => void;
    handleFocusInput: (value?: string) => void;
    onKeyPress?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const OrderInput: React.FunctionComponent<OrderInputProps> = React.memo((props: OrderInputProps) => {
    const {
        className,
        handleChangeValue,
        handleFocusInput,
        isFocused,
        isWrong,
        autoFocus,
        onKeyPress,
        placeholder,
        precision,
        currency,
        value,
        fixedLabel,
    } = props;

    const fieldsetFocusedClass = React.useMemo(() => cr('orders-type-field__fieldset', {
        'isfocused': isFocused,
        'iswrong': isWrong,
    }), [isFocused, isWrong]);

    const handleChangeValueByButton = (increase: boolean) => {
        let updatedValue = value;
        const increasedValue = (+updatedValue + (10 ** -precision)).toFixed(precision);
        const decreasedValue = (+updatedValue - (10 ** -precision)).toFixed(precision);

        updatedValue = increase ?
            increasedValue :
            +decreasedValue >= 0 ? decreasedValue : updatedValue;

        props.handleChangeValue(String(updatedValue));
    };

    return (
        <div className="orders-type-field buts-class">
            <fieldset className={cr(fieldsetFocusedClass, className)}>
                <InputOrders
                    type="number"
                    inputValue={value}
                    placeholder={placeholder || '0.00'}
                    handleChangeInput={handleChangeValue}
                    onKeyPress={onKeyPress}
                    handleFocusInput={() => handleFocusInput(props.label)}
                    autoFocus={autoFocus}
                    currencys={currency.toUpperCase()}
                    fixedLabel={fixedLabel}
                />
            </fieldset>
            <div className="orders-type-field__button">
                <div className="buts" onClick={() => handleChangeValueByButton(true)}>
                    <PlusIcon />
                </div>
                <div className="buts" onClick={() => handleChangeValueByButton(false)}>
                    <MinusIcon />
                </div>
            </div>
        </div>
    );
}, areEqualProps);
