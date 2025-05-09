import classnames from 'classnames';
import * as React from 'react';
import { Button } from '@mui/material';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector} from 'react-redux';
import { ModalMobile } from '../../mobile/components/ModalMobile';
import { CloseIcon } from 'src/assets/images/CloseIcon';
import {
    beneficiariesActivate,
    beneficiariesResendPin,
    Beneficiary,
    selectMobileDeviceState,
} from '../../modules';
import { CustomInput } from '../CustomInput';

interface Props {
    beneficiariesAddData: Beneficiary;
    handleToggleConfirmationModal: () => void;
}

export const BeneficiariesActivateModal: React.FC<Props> = (props: Props) => {
    const { beneficiariesAddData } = props;

    const [confirmationModalCode, setConfirmationModalCode] = React.useState('');
    const [confirmationModalCodeFocused, setConfirmationModalCodeFocused] = React.useState(false);

    const { formatMessage } = useIntl();
    const dispatch = useDispatch();

    const isMobileDevice = useSelector(selectMobileDeviceState);

    const handleChangeFieldValue = React.useCallback((key: string, value: string) => {
        setConfirmationModalCode(value);
    }, []);

    const handleChangeFieldFocus = React.useCallback((key: string) => {
        setConfirmationModalCodeFocused(v => !v);
    }, []);

    const handleClearModalsInputs = React.useCallback(() => {
        setConfirmationModalCode('');
        setConfirmationModalCodeFocused(false);
    }, []);

    const handleSubmitConfirmationModal = React.useCallback(() => {
        if (beneficiariesAddData) {
            const payload = {
                pin: confirmationModalCode,
                id: beneficiariesAddData.id,
            };

            dispatch(beneficiariesActivate(payload));
        }

        handleClearModalsInputs();
    }, [confirmationModalCode, dispatch, beneficiariesAddData, handleClearModalsInputs]);

    const handleResendConfirmationCode = React.useCallback(() => {
        if (beneficiariesAddData) {
            const payload = {
                id: beneficiariesAddData.id,
            };

            dispatch(beneficiariesResendPin(payload));
        }
    }, [beneficiariesAddData, dispatch]);

    const renderConfirmationModalBodyItem = React.useCallback((field: string, optional?: boolean) => {
        const focusedClass = classnames('verification-modal__content__group', {
            'verification-modal__content__group--focused': confirmationModalCodeFocused,
            'verification-modal__content__group--optional': optional,
        });

        return (
            <div key={field} className={focusedClass}>
                <CustomInput
                    type="string"
                    label={formatMessage({ id: `page.body.wallets.beneficiaries.confirmationModal.body.${field}` })}
                    placeholder={formatMessage({ id: `page.body.wallets.beneficiaries.confirmationModal.body.${field}` })}
                    defaultLabel={formatMessage({ id: 'page.body.kyc.phone.code' })}
                    handleChangeInput={value => handleChangeFieldValue(field, value)}
                    inputValue={confirmationModalCode}
                    handleFocusInput={() => handleChangeFieldFocus(`${field}Focused`)}
                    classNameLabel="absolute center"
                    classNameInput="text-center"
                    autoFocus={true}
                />
                <div className="beneficiaries-confirmation-modal__repeat">
                    <Button
                        onClick={handleResendConfirmationCode}
                        className={`little-button blue ${isMobileDevice && 'themes'}`}
                    >
                        {formatMessage({ id: 'page.body.wallets.beneficiaries.confirmationModal.body.resendButton' })}
                    </Button>
                </div>
            </div>
        );
    },  [confirmationModalCodeFocused, confirmationModalCode, formatMessage, handleChangeFieldFocus, handleChangeFieldValue]);

    const renderConfirmationModalBody = React.useCallback(() => {
        const isDisabled = !confirmationModalCode;

        return (
            <React.Fragment>
                <div className="beneficiaries-confirmation-modal__phone__header">
                    {formatMessage({ id: 'page.body.wallets.beneficiaries.confirmationModal.body.text' })}
                </div>
                {renderConfirmationModalBodyItem('confirmationModalCode')}
                <div className="beneficiaries-confirmation-modal__footer">
                    <Button
                        onClick={handleSubmitConfirmationModal}
                        className={`medium-button ${isMobileDevice && 'themes'}`}
                        disabled={isDisabled}
                    >
                        {formatMessage({ id: 'page.body.wallets.beneficiaries.confirmationModal.body.button' })}
                    </Button>
                </div>
            </React.Fragment>
        );
    }, [confirmationModalCode, formatMessage, handleResendConfirmationCode, handleSubmitConfirmationModal, renderConfirmationModalBodyItem]);

    const formClass = React.useMemo(() => classnames('beneficiaries-confirmation-modal__phone', {
        'beneficiaries-confirmation-modal--mobile': isMobileDevice,
    }),[isMobileDevice]);

    const renderContent = React.useCallback(() => {
        return (
            <div className="beneficiaries-confirmation-modal">
                <div className={formClass}>
                    {renderConfirmationModalBody()}
                </div>
            </div>
        );
    }, [isMobileDevice, renderConfirmationModalBody, formClass]);

    const renderContentMobile = React.useCallback(() => {
        return (
            <div className="verification-modal">
                <div className="verification-modal__content">
                    {renderConfirmationModalBody()}
                </div>
            </div>
        );
    }, [isMobileDevice, renderConfirmationModalBody, formClass]);

    return (
        isMobileDevice ? renderContentMobile() : renderContent()
    );
};