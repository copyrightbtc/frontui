import classnames from 'classnames';
import * as React from 'react';
import { Button } from '@mui/material';
import { useIntl } from 'react-intl';
import { Modal } from '../../mobile/components/Modal';

interface Props {
    handleToggleFailModal: () => void;
    isMobileDevice?: boolean;
}


const BeneficiariesFailAddModalComponent: React.FC<Props> = (props: Props) => {
    const { formatMessage } = useIntl();
    const { isMobileDevice } = props;

    const ModalBody = React.useCallback(() => (
        <React.Fragment>
            <span className="beneficiaries-confirmation-modal__phone__header">
                {formatMessage({ id: 'page.body.wallets.beneficiaries.failAddModal.content' })}
            </span>

            <div className="modal-window__container__footer">
                <Button
                    href="/profile"
                    className="medium-button"
                >
                    {formatMessage({ id: 'page.body.wallets.beneficiaries.failAddModal.button' })}
                </Button>
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
            <Modal
                isOpen
                onClose={props.handleToggleFailModal}
                title={formatMessage({ id: 'page.body.wallets.beneficiaries.failAddModal.content' })}>
                {renderContent()}
            </Modal> : renderContent()
    );
};

const BeneficiariesFailAddModal = React.memo(BeneficiariesFailAddModalComponent);

export {
    BeneficiariesFailAddModal,
};
