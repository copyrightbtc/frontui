import '@openware/cryptofont';
import classnames from 'classnames';
import * as React from 'react';
import { copy } from '../../helpers';
import { InputWithButton } from "src/components/InputWithButton";
import { IconButton } from '@mui/material';
import { CopyIcon } from 'src/assets/images/CopyIcon';

export interface CopyableTextFieldProps {
    value: string;
    className?: string;
    fieldId: string;
    copyButtonText?: string;
    disabled?: boolean;
    label?: string;
}

/**
 * Text field component with ability to copy inner text.
 */
class CopyableTextField extends React.Component<CopyableTextFieldProps> {
    public componentDidMount() {
        if (!this.props.fieldId) {
            throw new Error('CopyableTextField must contain `fieldId` prop');
        }
    }

    public render() {
        const {
            value,
            className,
            disabled,
            fieldId,
            copyButtonText,
            label,
        } = this.props;
        const doCopy = () => copy(fieldId);
        const cx = classnames('copyable-text-field', className);

        return (
            <InputWithButton
                value={value}
                className={cx}
                fieldId={fieldId}
                readOnly
                handleClickInput={doCopy}
                handleClickButton={doCopy}
                type="text"
                disabled={disabled}
                label={label}
                buttonText={copyButtonText}
                buttonClassName="copyable-text-field__button"
                icon={
                    <IconButton 
                        className="copy_button"
                        sx={{
                            width: '39px',
                            height: '39px',
                        }}>
                        <CopyIcon className="copy-iconprop"/> 
                    </IconButton>
                }
            />
        );
    }
}

export {
    CopyableTextField,
    copy,
};
