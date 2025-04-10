import React from 'react';
import { useIntl } from 'react-intl';
import { Button, IconButton } from '@mui/material';
import { CloseIcon } from '../../assets/images/CloseIcon';

export const P2PTradeSuccessComponent = props => {
    const { formatMessage } = useIntl();

    const handleP2PTradeSuccess = () => {
      props.handleP2PTradeSuccess();
    };

    function RoundNumber(n: string | number, precision: number): string {
    if (typeof n === 'string') return RoundNumber(Number(n), precision)
    
    return n.toLocaleString('en-US', { minimumFractionDigits: precision, maximumFractionDigits: precision })
    }

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

    const renderFooter = () => {
        return (
            <div className="modal-window__button">
                <Button
                    className='medium-button themes'
                    onClick={handleP2PTradeSuccess}
                >
                    <span>{formatMessage({id: 'page.body.p2p.trade.feedback.button'})}</span>
                </Button>
            </div>
        );
    };

    return (
        <div className='login-form'>
            <div className='login-form__content'>
                {renderHeader()} 
                <div className="login-form__success">
                    <span>
                        {props.side === 'buy' ? formatMessage({id: 'page.body.p2p.trade.success.get'}) : formatMessage({id: 'page.body.p2p.trade.sentquantity'})}
                    </span>
                    <div className="login-form__success__number">
                        {`${props.side === 'buy' ? RoundNumber(props.p2pTrade.amount, 2) : RoundNumber(Number(props.p2pTrade.amount) * Number(props.p2pTrade.price), 2)} ${props.side === 'buy' ? props.p2pTrade.coin_currency.toUpperCase() : props.p2pTrade.fiat_currency.toUpperCase()}`}
                    </div>
                </div>
                {renderFooter()}
            </div> 
        </div>
    );
};

export const P2PTradeSuccess = React.memo(P2PTradeSuccessComponent);
