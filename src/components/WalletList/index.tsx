import React, { useCallback } from 'react';
import { Wallet, Currency, Ticker, Market } from '../../modules';
import { WalletItem } from '../WalletItem';
export interface WalletListProps {
    walletItems: Wallet[];
    activeIndex: number;
    currencies: Currency[];
    tickers:{
        [key: string]: Ticker,
    }
    markets: Market[];
    onWalletSelectionChange(item: Wallet): void;
    onActiveIndexChange(index: number): void;
}

const removeAlt = (str: string): string => str.replace('-alt', '');
 
export const WalletList: React.FC<WalletListProps> = ({
    onWalletSelectionChange,
    onActiveIndexChange,
    activeIndex,
    walletItems,
    currencies,
    markets,
    tickers,
}) => {
    const handleClick = useCallback(
        (i: number, p: Wallet) => {
            if (onWalletSelectionChange) {
                onWalletSelectionChange(p);
            }
            if (onActiveIndexChange) {
                onActiveIndexChange(i);
            }
        },
        [onWalletSelectionChange, onActiveIndexChange]
    ); 
    return (
        <React.Fragment>
            {walletItems.map((p: Wallet, i: number) => (
                <div key={i} onClick={() => handleClick(i, p)}>
                    <WalletItem
                        currencies={currencies}
                        tickers={tickers}
                        markets={markets}
                        key={i}
                        {...{
                            ...p,
                            active: activeIndex === i,
                            currency: removeAlt(p.currency),
                        }}
                    />
                </div>
            ))}
        </React.Fragment>
    );
};
