import React from 'react';
import { useIntl } from 'react-intl';
import { Button, IconButton } from '@mui/material';
import { CloseIcon } from '../../assets/images/CloseIcon';

export const ApproveP2PTradeComponent = props => {
    const { formatMessage } = useIntl();

    const handleApproveP2PTrade = () => {
        props.handleApproveP2PTrade(props.p2pTrade.tid);
    };
 
    const renderHeader = () => (
        <div className="modal-window__container__header">
            <h1>{props.title}</h1>
            <div className="modal-window__container__header__close">
                <IconButton 
                    onClick={props.closeModal}
                    sx={{
                        color: '#fff',
                        '&:hover': {
                            color: 'var(--color-accent)'
                        }
                    }}
                >
                    <CloseIcon className="icon_closeed"/>
                </IconButton>
            </div>             
        </div>
    );

    const renderBody = () => {
        return (
            <React.Fragment>
                {props.p2pTrade.payment.payment_type === 'bank' && (
                    <div className='modal-window__title'>{formatMessage({id: 'page.body.p2p.payments.type.bank'})}</div>
                )}
                <div className='modal-window__trade'>
                    <div className='modal-window__trade__rows'>
                        <span>{formatMessage({id: 'page.body.p2p.payments.account_name'})}</span>
                        <div className='name'>{props.p2pTrade.payment.account_name}</div>
                    </div>
                { props.p2pTrade.payment.payment_type === 'bank' && (
                    <>
                        <div className='modal-window__trade__rows'>
                            <span>{formatMessage({id: 'page.body.p2p.payments.bank_account'})}</span>
                            <div className='name'>{props.p2pTrade.payment.data.bank_account}</div>
                        </div>
                        <div className='modal-window__trade__rows'>
                            <span>{formatMessage({id: 'page.body.p2p.payments.bank_name'})}</span>
                            <div className='name'>{props.p2pTrade.payment.data.bank_name}</div>
                        </div>
                        <div className='modal-window__trade__rows'>
                            <span>{formatMessage({id: 'page.body.p2p.trade.transfer_content'})}</span>
                            <div className='name'>{props.p2pTrade.tid}</div>
                        </div>
                    </>
                )}
                </div>
            </React.Fragment>
        );
    };

    const renderFooter = () => {
        return (
            <div className="modal-window__button">
                <Button
                    className='medium-button themes'
                    onClick={handleApproveP2PTrade}
                >
                    <span>{formatMessage({id: 'page.body.p2p.trade.approve.title'})}</span>
                </Button>
            </div>
        );
    };

    return (
        <div className='login-form'>
            <div className='login-form__content'>
                {renderHeader()}
                {renderBody()}
                {renderFooter()}
            </div>
        </div>
    );
};

export const ApproveP2PTrade = React.memo(ApproveP2PTradeComponent);
