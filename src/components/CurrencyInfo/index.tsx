import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Wallet } from '../../modules';
import { Decimal } from '../Decimal';
import { LockIconMoney } from '../../assets/images/LockIconMoney';
import { AvalaibleIconMoney } from '../../assets/images/AvalaibleIconMoney';

export interface CurrencyInfoProps {
    wallet: Wallet;
    handleClickTransfer?: (value: string) => void;
}
 
const CurrencyInfo: React.FunctionComponent<CurrencyInfoProps> = (props: CurrencyInfoProps) => {
    const balance = props.wallet && props.wallet.balance ? props.wallet.balance.toString() : '0';
    const lockedAmount = props.wallet && props.wallet.locked ? props.wallet.locked.toString() : '0';
    const currency = (props.wallet || { currency: '' }).currency.toUpperCase();
    const selectedFixed = (props.wallet || { fixed: 0 }).fixed;

    const stringLocked = lockedAmount ? lockedAmount.toString() : undefined;
 
    return (
        <div className="currency-info"> 
                <div className="currency-info__row">
                    <h4>
                        <FormattedMessage id="page.body.wallets.overview.header.total"/>
                    </h4>
                    <div className="currency-info__row__amount">
                        <Decimal fixed={selectedFixed} thousSep="," children={+(balance || 0) + +(stringLocked || 0)}/>
                        <strong>{currency}</strong>
                    </div>                    
                </div>
                <div className="currency-info__row">
                    <h4>
                        <div className="currency-icon"><AvalaibleIconMoney /></div>
                        <FormattedMessage id="page.body.wallets.overview.header.available"/>
                    </h4>
                    <div className="currency-info__row__amount">
                        <Decimal fixed={selectedFixed} thousSep="," children={balance}/>
                        <strong>{currency}</strong>
                    </div> 
                </div>
                <div className="currency-info__row">
                    <h4>
                        <div className="currency-icon"><LockIconMoney /></div>
                        <FormattedMessage id="page.body.wallets.overview.header.locked" />
                    </h4>
                    <div className="currency-info__row__amount">
                        <Decimal fixed={selectedFixed} thousSep="," children={stringLocked}/>
                        <strong>{currency}</strong>
                    </div>
                </div>
        </div>
    );
};

export {
    CurrencyInfo,
};
