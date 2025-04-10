import React, { ReactNode } from 'react';
import { FormControl, InputGroup } from 'react-bootstrap';

export interface IconInputProps {
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
}

interface OnChangeEvent {
    target: {
        value: string;
    };
}
type Props = IconInputProps;

class IconInput extends React.Component<Props> {
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
        } = this.props;
 
        return (
            <React.Fragment>
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
                </InputGroup>
            </React.Fragment>
        );
    }

    private handleChangeValue = (e: OnChangeEvent) => {
        this.props.handleChangeInput && this.props.handleChangeInput(e.target.value);
    };
}

export {
    IconInput,
};
