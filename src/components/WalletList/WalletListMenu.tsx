import * as React from 'react';
import { useSelector } from 'react-redux';
import { CryptoIcon } from '../../components/CryptoIcon';
import { DEFAULT_CCY_PRECISION, DEFAULT_FIAT_PRECISION } from '../../constants';
import { areEqualSelectedProps } from '../../helpers/areEqualSelectedProps';
import { estimatePlatformValue } from '../../helpers/estimateValue';
import { Decimal } from 'src/components';
import { selectCurrencies } from 'src/modules';

interface Props {
    wallet;
    onClick: (v: string) => void;
}
 
const WalletListMenuComponent = (props: Props) => {
    const currencies = useSelector(selectCurrencies);
    const {
        wallet: {
            currency = '',
            name,
            balance = 0,
            locked = 0,
            fixed = DEFAULT_CCY_PRECISION,
        },
    } = props;
    
    const totalBalance = Number(balance || 0) + Number(locked || 0);
    const estimatedValueTotal = estimatePlatformValue(currency, currencies, totalBalance);

    return (
        <div className="walletlist-menu" onClick={() => props.onClick(currency)}>
            <div className="walletlist-menu__coin">
                <CryptoIcon className="currency-icon" code={currency.toUpperCase()} />
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

const WalletListMenu = React.memo(WalletListMenuComponent, areEqualSelectedProps('wallet', ['currency', 'name', 'balance', 'fixed']));

export {
    WalletListMenu,
};
