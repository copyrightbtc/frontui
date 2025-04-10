import React, { ReactNode } from 'react';
import { FormControl, InputGroup } from 'react-bootstrap';

export interface CustomInputProps {
    type: string;
    handleChangeInput?: (value: string) => void;
    inputValue: string | number;
    handleFocusInput?: () => void;
    placeholder: string; 
    autoFocus?: boolean;
    onKeyPress?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    readOnly?: boolean;
    id?: string;
    handleClick?: ((event: React.MouseEvent<HTMLInputElement, MouseEvent>) => void);
    autoComplete?: string;
    currencys?: ReactNode;
    fixedLabel?: ReactNode;
}

interface OnChangeEvent {
    target: {
        value: string;
    };
}
type Props = CustomInputProps; 
class InputOrders extends React.Component<Props> {
    public render() {
        const {
            placeholder,
            inputValue,
            type,
            autoFocus,
            readOnly,
            id,
            handleClick,
            onKeyPress,
            autoComplete,
            currencys,
            fixedLabel
        } = this.props;

        return (
            <React.Fragment>
                <InputGroup bsPrefix="orders-type-field__inputs">
                    <div className='fixlabel'>{fixedLabel}</div>
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
                        onKeyPress={onKeyPress}
                        autoComplete={autoComplete}
                    />
                    {currencys}
                </InputGroup>
            </React.Fragment>
        );
    }

    private handleChangeValue = (e: OnChangeEvent) => {
        this.props.handleChangeInput && this.props.handleChangeInput(e.target.value);
    };
}

export {
    InputOrders,
};
