import React, { ReactNode, useCallback, useEffect } from "react";
import { RootState, selectMobileDeviceState } from "../../modules";
import { connect } from "react-redux";


type ReduxProps = {
    isMobileDevice?: boolean;
}

export interface InputProps extends ReduxProps {
    label?: string;
    id?: string
    value?: string,
    placeholder?: string,
    onChange?(value: string): void,
    type?: "number" | "text",
    suffix?: ReactNode,
    name?: string;
    areaText?: boolean;
    minLength?: number;
    maxLength?: number;
    maxNumber?: number;
    minNumber?: number;
    decimalScale?: number;
    selectOnFocus?: boolean;
    onBlur?(): void,
    onFocus?(): void,
    error?: string,
    errorMessage?: ReactNode,
}

const Input = ({
    isMobileDevice,
    id,
    value,
    onChange,
    placeholder,
    suffix,
    label,
    type,
    areaText,
    minLength,
    maxLength,
    maxNumber,
    minNumber,
    decimalScale = 2,
    selectOnFocus,
    onFocus,
    onBlur,
    error,
    errorMessage,
    ...rest
}: InputProps) => {
    const [inputValue, setInputValue] = React.useState(value);
    const [focused, setFocused] = React.useState(false);

    const inputRef = React.createRef<HTMLInputElement>();

    const compareChangeValue = useCallback(() => {
        const [wholePart, decimalPart] = (value ?? "").split(".");
    
        // Apply commas to the whole part
        const transformedWholePart = wholePart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    
        // Reconstruct the transformed value
        let transformedValue = transformedWholePart;
        if (decimalPart !== undefined) {
            transformedValue += `.${decimalPart}`;
        }
    
        // Set the input value only if it differs
        if ((type === "number" && transformedValue !== inputValue) || (value !== inputValue)) {
            setInputValue(value !== undefined && value !== null ? transformedValue : "");
        }
    }, [inputValue, value, type]);

    useEffect(() => {
        compareChangeValue();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);


    const changeNumberValue = (_value: string) => {
        const transformedValue = _value.replace(/,/g, '');
        if (!Number.isNaN(Number(transformedValue))) {
            onChange && onChange(transformedValue);
        }
    }

    const handleChange = (e) => {
        if (type === "number") {
            let _value: string = (e.target.value ?? "").replaceAll(",", "").trim();
            if (_value.startsWith(".")) {
                _value = "0" + _value;
            }
            if (!_value.endsWith(".") && Number.isNaN(Number(_value))) {
                return;
            }
            if (maxNumber && Number(_value) > maxNumber) {
                return;
            }
            if (minNumber && Number(_value) < minNumber) {
                return;
            }
            if (
                _value.indexOf(".") > -1 &&
                (!decimalScale || _value.length - _value.indexOf(".") > decimalScale + 1)
            ) {
                return;
            }
            _value = _value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            setInputValue(_value);
            changeNumberValue(_value);
        } else {
            if (maxLength && (e.target.value || "").length > maxLength) {
                return;
            }
            if (minLength && (e.target.value || "").length < minLength) {
                return;
            }
            setInputValue(e.target.value);
            onChange && onChange(e.target.value);
        }
    };

    const suffixMarkup = suffix ? <div className="input-suffix">{suffix}</div> : null;
    const customLabel = label ? <div className="input-upper"><label>{label}</label></div> : null;
    const erroShow = errorMessage ? <div className="input-bottom">{errorMessage}</div> : null;

    return (
        <div className={`desk-input${isMobileDevice ? " mobile-input" : ""}${suffix ? " include_suffix" : ""}${focused ? " focused" : ""}${error ? " error" : ""}`}>
            {customLabel}
            <div className="input-content">
                <input
                    {...rest}
                    ref={inputRef}
                    id={id}
                    value={inputValue}
                    className={`input ${type === "number" ? "font-semibold" : ""}`}
                    onChange={handleChange}
                    placeholder={placeholder}
                    onFocus={() => {
                        onFocus && onFocus();
                        setFocused(true);
                    }}
                    onBlur={() => {
                        onBlur && onBlur();
                        setFocused(false);
                    }}
                    onClick={(e) => selectOnFocus && (e.target as HTMLInputElement)?.select()}
                />
                {suffixMarkup}
            </div>
            {erroShow}
        </div>
    );
}


const mapStateToProps = (state: RootState): ReduxProps => ({
    isMobileDevice: selectMobileDeviceState(state),
});

export default connect(mapStateToProps)(Input);