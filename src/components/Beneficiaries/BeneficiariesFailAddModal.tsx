import classnames from 'classnames';
import * as React from 'react';
import { Button } from '@mui/material';
import { useIntl } from 'react-intl';
import { ModalMobile } from '../../mobile/components/ModalMobile';
import { CloseIcon } from '../../assets/images/CloseIcon';

interface Props {
    handleToggleFailModal: () => void;
    isMobileDevice?: boolean;
}

export const BeneficiariesFailAddModal: React.FC<Props> = (props: Props) => {
    const { formatMessage } = useIntl();
    const { isMobileDevice } = props;

    const ModalBody = React.useCallback(() => (
        <React.Fragment>
            <span className="beneficiaries-confirmation-modal__phone__header">
                {formatMessage({ id: 'page.body.wallets.beneficiaries.failAddModal.content' })}
            </span>

            <div className="modal-window__container__footer">
                {isMobileDevice ? 
                <Button
                    href="/profile/verification"
                    className="medium-button themes"
                >
                    {formatMessage({ id: 'page.body.wallets.beneficiaries.failAddModal.button' })}
                </Button> : 
                <Button
                    href="/profile"
                    className="medium-button"
                >
                    {formatMessage({ id: 'page.body.wallets.beneficiaries.failAddModal.button' })}
                </Button>}
            </div>
        </React.Fragment>
    ), [formatMessage]);

    const renderContent = React.useCallback(() => {
        const className = classnames('beneficiaries-confirmation-modal__phone', {
            'beneficiaries-confirmation-modal--mobile': !isMobileDevice,
        });

        return (
            <div className="beneficiaries-confirmation-modal">
                <div className={className}>
                    <ModalBody/>
                </div>
            </div>
        );
    }, [isMobileDevice]);

    return (
        props.isMobileDevice ?
            <ModalMobile
                isOpen
                onClose={props.handleToggleFailModal}
            >
                <div className="mobile-modal__header">
                    <div className="mobile-modal__header-title"></div>
                    <div className="mobile-modal__header-close" onClick={props.handleToggleFailModal}>
                        <CloseIcon />
                    </div>
                </div>
                {renderContent()}
            </ModalMobile> : renderContent()
    );
};

