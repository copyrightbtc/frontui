import * as React from 'react';
import { Wallet, Currency, Market, Ticker } from '../../modules';
import { estimatePlatformValue } from '../../helpers/estimateValue';
import { CryptoIcon } from '../CryptoIcon';
import { Decimal } from '../Decimal';
import { DEFAULT_FIAT_PRECISION } from '../../constants';
 
interface WalletItemProps {
    currencies: Currency[];
    tickers:{
        [key: string]: Ticker,
    };
    markets: Market[];
}

type Props = Wallet & WalletItemProps;
/**
 * Component for displaying information about wallet, including address and amount of currency.
 */
export const WalletItem: React.FunctionComponent<Props> = (props: Props) => {
    const {
        currency,
        name,
        balance,
        locked,
        fixed,
        currencies,
        active,
    } = props;
 
    const cName = `walletlist-menu${active ? ' chosen' : ''}`;

    const walletIcon = React.useMemo(() => {
        if (currency) {
            return <CryptoIcon className="currency-icon" code={currency.toUpperCase()} />;
        }

        return null;
    }, [currency]);

    const totalBalance = Number(balance || 0) + Number(locked || 0);
    const estimatedValueTotal = estimatePlatformValue(currency, currencies, totalBalance);

    return (
        <div className={cName}>
            <div className="walletlist-menu__coin">
                {walletIcon}
                <div className="info-col">
                    <span className="bold">{currency?.toUpperCase()}</span>
                    <span className="secondary">{name}</span>
                </div>
            </div>
            <div className="walletlist-menu__balance">
                <span className="bold">
                    <Decimal fixed={fixed} children={+(balance || 0) + +(locked || 0)} thousSep=","/>
                </span>
                <span className="secondary">
                    ≈ $<Decimal fixed={DEFAULT_FIAT_PRECISION} thousSep=",">{estimatedValueTotal}</Decimal>
                </span>
            </div>
        </div>
    );
};
