import '@openware/cryptofont';
import classnames from 'classnames';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { copy } from '../../helpers';
import { InputWithButton } from "src/components/InputWithButton";
import { IconButton } from '@mui/material';
import { CopyIcon } from 'src/assets/images/CopyIcon';
import { selectMobileDeviceState } from 'src/modules';
import { useReduxSelector } from 'src/hooks';

export interface CopyableTextFieldProps {
    value: string;
    className?: string;
    fieldId: string;
    copyButtonText?: string;
    disabled?: boolean;
    label?: string;
}

const CopyableTextField: React.FC<CopyableTextFieldProps> = (props: CopyableTextFieldProps) => {
    
    React.useEffect(() => {
        if (!props.fieldId) {
            throw new Error('CopyableTextField must contain `fieldId` prop');
        }
    }, []);

    const isMobileDevice = useReduxSelector(selectMobileDeviceState);

    const {
        value,
        className,
        disabled,
        fieldId,
        copyButtonText,
        label,
    } = props;

    const { formatMessage } = useIntl();
    const translate = (id: string) => formatMessage({ id });
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
                <React.Fragment>
                    {!isMobileDevice ? <IconButton 
                        className="copy_button"
                        sx={{
                            width: '39px',
                            height: '39px',
                        }}>
                        <CopyIcon className="copy-iconprop"/> 
                    </IconButton> : translate('page.body.wallets.tabs.deposit.copy.button.tap')}
                </React.Fragment>
            }
        />
    );
}

export {
    CopyableTextField,
    copy,
};
