import React from 'react';
import { Button, IconButton } from '@mui/material';
import { CloseIcon } from '../../assets/images/CloseIcon';
import { useIntl } from 'react-intl';

export const DeletePaymentComponent = props => {
    const { formatMessage } = useIntl();

    const handleDeletePayment = () => {
        props.handleDeletePayment(Number(props.payment.id));
    };
 
    const handleEnterPress = React.useCallback(
        (event: React.KeyboardEvent<HTMLDivElement>) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                handleDeletePayment();
            }
        },
        [handleDeletePayment]
    );

    const renderHeader = () => (
        <div className="modal-window__container__header"> 
            <h1>{props.title}</h1>
            <div className="modal-window__container__header__close">
                <IconButton 
                    onClick={props.closeModal}
                    sx={{
                        color: 'var(--color-dark)',
                        '&:hover': {
                            color: 'var(--color-accent)'
                        }
                    }}
                >
                    <CloseIcon className="icon_closeed themes"/>
                </IconButton>
            </div>
        </div>
    );

    const renderBody = () => {
        return (
            <div className='delete-payment-modal' onKeyPress={handleEnterPress}>
                <div className='delete-payment-modal__row'>
                    <p>{formatMessage({id: 'page.body.p2p.payments.type'})}</p>
                    {props.payment.payment_type === 'bank' && (
                        <span>{formatMessage({id: 'page.body.p2p.payments.type.bank'})}</span>
                    )}
                </div>
                <div className='delete-payment-modal__row'>
                    <p>{formatMessage({id: 'page.body.p2p.payments.account_name'})}</p>
                    <span>{props.payment.account_name}</span>
                </div>
                {Object.keys(props.payment.data).map(key => (
                    <div className='delete-payment-modal__row'>
                        <p>{formatMessage({id: `page.body.p2p.payments.${key}`})}</p>
                        <span>{props.payment.data[key]}</span>
                    </div>
                ))}
            </div>
        );
    };
 
    const renderFooter = () => {
        return (
            <div className="modal-window__button">
                <Button
                    onClick={handleDeletePayment} 
                    className="medium-button themes red"
                >
                    {formatMessage({id: 'page.body.p2p.payments.delete'})}
                </Button>
            </div>
        );
    };
 
    return (
        <form className="modal-window__container fadet"> 
            <div className="login-form"> 
                <div className="login-form__content">
                    {props.title && renderHeader()}
                    <div className="modal-window__title">
                        {formatMessage({id: 'page.body.p2p.payments.modal.delete.sure'})}
                    </div>
                    {renderBody()}
                    {renderFooter()}
                </div>
            </div> 
        </form>
    );
};

export const DeletePayment = React.memo(DeletePaymentComponent);
