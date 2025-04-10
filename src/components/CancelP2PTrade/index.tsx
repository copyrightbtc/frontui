import React from 'react';
import { Button, IconButton } from '@mui/material';
import { CloseIcon } from '../../assets/images/CloseIcon';
import { useIntl } from 'react-intl';

export const CancelP2PTradeComponent = props => {
    const { formatMessage } = useIntl();

    const handleCancelP2PTrade = () => {
        props.handleCancelP2PTrade(props.tid);
    };

    return (
        <div className='login-form'>
            <div className='login-form__content'>
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
                <div className='modal-window__title'>
                    {props.contents}
                </div>
                <div className="modal-window__button">
                    <Button
                        className='medium-button themes red'
                        onClick={handleCancelP2PTrade}
                    >
                        <span>{formatMessage({id: 'page.body.p2p.trade.cancel.button'})}</span>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export const CancelP2PTrade = React.memo(CancelP2PTradeComponent);
