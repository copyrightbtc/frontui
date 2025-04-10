import React, { FC, ReactElement, useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import { EstimatedValue } from 'src/containers'; 
import { useDocumentTitle, useWalletsFetch } from 'src/hooks';
import { selectCurrencies, selectWallets, Wallet } from 'src/modules';

export const EstimatedValueAvail: FC = (): ReactElement => {
    const [mergedWallets, setMergedWallets] = useState<Wallet[]>([]);

    const wallets = useSelector(selectWallets) || [];
    const currencies = useSelector(selectCurrencies);

    const { formatMessage } = useIntl();
    const translate = useCallback((id: string) => formatMessage({ id }), [formatMessage]);

    useDocumentTitle(translate('page.header.navbar.wallets'));
    useWalletsFetch();

    useEffect(() => {
        if (wallets.length && currencies.length) {
            const merged = currencies.map(cur => {
                const spotWallet = wallets.find(i => i.currency === cur.id);

                return {
                    ...spotWallet,
                    balance: String(+(spotWallet?.balance || 0)),
                };
            });

            setMergedWallets(merged);
        }
    }, [wallets, currencies]);

    return (
        <EstimatedValue wallets={mergedWallets} />
    );
};
