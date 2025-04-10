import classnames from 'classnames';
import * as React from 'react';
import { InputGroup } from 'react-bootstrap';
import { CustomInput } from '../';
import { MouseEventHandler } from "react";

const InputWithButton = ({
    value,
    className,
    fieldId = '',
    disabled = false,
    readOnly = false,
    handleFocusInput = () => {},
    buttonText = '',
    label = '',
    type = "text",
    handleClickInput = () => {},
    handleClickButton = () => {},
    handleChangeInput = () => {},
    buttonClassName = '',
    icon,
}: {
    value: any;
    className: string;
    fieldId?: string | number;
    disabled?: boolean;
    buttonText?: string;
    label?: string;
    type?: string;
    readOnly?: boolean;
    handleFocusInput?: () => void;
    buttonClassName?: string;
    handleClickInput?: MouseEventHandler;
    handleClickButton?: MouseEventHandler;
    handleChangeInput?: (value: string) => void;
    icon?: React.ReactElement;
}) => {
    const cx = classnames('input-with-button', className);

    return (
        <div className={cx}>
            <InputGroup>
                <CustomInput
                    id={String(fieldId)}
                    readOnly={readOnly}
                    inputValue={value}
                    handleClick={handleClickInput}
                    type={type}
                    isDisabled={disabled}
                    label={label}
                    defaultLabel={label}
                    placeholder={label}
                    handleChangeInput={handleChangeInput}
                    classNameInput={"input-name"}
                    handleFocusInput={handleFocusInput}
                /> 
                <button
                    onClick={handleClickButton}
                    disabled={disabled}
                    className={buttonClassName || "input-button"}
                >
                    {icon ? icon : null}
                    {buttonText}
                </button>
            </InputGroup>
        </div>
    )
}

export {
    InputWithButton,
}
