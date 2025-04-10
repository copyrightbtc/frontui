import cr from 'classnames';
import React, { ReactNode } from 'react';
import { InputOrders } from './InputOrders';

export interface OrderInputProps {
    className?: string;
    currency: string;
    isFocused: boolean;
    isWrong?: boolean;
    label?: string;
    fixedLabel?: string;
    labelVisible?: boolean;
    placeholder?: string;
    autoFocus?: boolean;
    value: string | number;
    handleChangeValue: (text: string) => void;
    handleFocusInput: (value?: string) => void;
    onKeyPress?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    suffix?: ReactNode,
}

/**
 * Input with cryptocurrency icon and label.
 */

export const OrderInput: React.FunctionComponent<OrderInputProps> = React.memo((props: OrderInputProps) => {
    const {
        autoFocus,
        className,
        currency,
        handleChangeValue,
        handleFocusInput,
        isFocused,
        isWrong,
        label,
        onKeyPress,
        placeholder,
        value,
        suffix,
        fixedLabel,
    } = props;

    const fieldsetFocusedClass = React.useMemo(() => cr('orders-type-field__fieldset', {
        'isfocused': isFocused,
        'iswrong': isWrong,
    }), [isFocused, isWrong]);

    return (
        <div className="orders-type-field">
            <div className='label-container'><label>{label ? label : ''}</label>{suffix}</div>
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
        </div>
    );
});
