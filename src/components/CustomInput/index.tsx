import React, { ReactNode } from 'react';
import { FormControl, InputGroup } from 'react-bootstrap';
import { PasteIcon } from 'src/assets/images/PasteIcon';
import { IconButton } from '@mui/material';

export interface CustomInputProps {
    type: string;
    label?: string;
    defaultLabel?: string;
    handleChangeInput?: (value: string) => void;
    inputValue: string | number;
    handleFocusInput?: () => void;
    placeholder: string;
    classNameLabel?: string;
    classNameInput?: string;
    autoFocus?: boolean;
    onKeyPress?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    readOnly?: boolean;
    id?: string;
    handleClick?: ((event: React.MouseEvent<HTMLInputElement, MouseEvent>) => void);
    isDisabled?: boolean;
    labelVisible?: boolean;
    autoComplete?: string;
    suffix?: ReactNode,
    name?: string;
    maxLength?: number;
    pasteIcon?: boolean;
}

interface OnChangeEvent {
    target: {
        value: string;
    };
}
type Props = CustomInputProps; 
class CustomInput extends React.Component<Props> {
    public render() {
        const {
            placeholder,
            inputValue,
            type,
            autoFocus,
            readOnly,
            classNameInput,
            id,
            handleClick,
            isDisabled,
            onKeyPress,
            autoComplete,
            name,
            maxLength,
            suffix,
            labelVisible,
            defaultLabel,
            classNameLabel,
            pasteIcon
        } = this.props;
 
        const pasteButton = async () => {
            const text = await navigator.clipboard?.readText();
            let inputList = '';
        
            for (const char of text) {
                inputList += char.toString();
                this.props.handleChangeInput(inputList);
            }
        
        }; 
        return (
            <React.Fragment>
                <label className={classNameLabel}>
                    {(labelVisible || inputValue) && (defaultLabel)}
                </label>
                <InputGroup>
                    {suffix}
                    <FormControl
                        bsPrefix="inputs-custom"
                        type={type}
                        value={inputValue.toString()}
                        placeholder={placeholder}
                        autoFocus={autoFocus}
                        onFocus={this.props.handleFocusInput}
                        onBlur={this.props.handleFocusInput}
                        onChange={e => this.handleChangeValue(e)}
                        readOnly={readOnly}
                        id={id}
                        onClick={handleClick}
                        disabled={isDisabled}
                        onKeyPress={onKeyPress}
                        autoComplete={autoComplete}
                        maxLength={maxLength}
                        name={name}
                        className={classNameInput}
                    />
                    {pasteIcon && 
                        <div className="paste_button">
                            <IconButton 
                                onClick={pasteButton}
                                sx={{
                                    width: '39px',
                                    height: '39px',
                                }}
                            >
                                <PasteIcon />
                            </IconButton>
                        </div>
                    }
                </InputGroup>
            </React.Fragment>
        );
    }

    private handleChangeValue = (e: OnChangeEvent) => {
        this.props.handleChangeInput && this.props.handleChangeInput(e.target.value);
    };
}

export {
    CustomInput,
};
