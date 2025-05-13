import React, { FC, ReactElement, useCallback } from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { useDocumentTitle, useWalletsFetch } from 'src/hooks';
import { selectWallets } from '../../../modules/user/wallets';
import { WalletBanner, WalletsButtons } from '../../components';
import { WalletsHistory } from '../WalletsHistory';

export const SelectedWalletMobileScreen: FC = (): ReactElement => {

    const { formatMessage } = useIntl();
    const translate = useCallback((id: string) => formatMessage({ id }), [formatMessage]);

    const { currency = '' } = useParams<{ currency?: string }>();
    const wallets = useSelector(selectWallets) || [];

    useDocumentTitle(`${translate('page.body.wallets.overview.header.wallet')} ${currency.toUpperCase()}`)

    const wallet = wallets.find(item => item.currency === currency) || { name: '', currency: '' };

    useWalletsFetch();

    return (
        <React.Fragment>
            <WalletBanner wallet={wallet} />
            <WalletsHistory />
            <WalletsButtons currency={wallet.currency} />
        </React.Fragment>
    );
};
