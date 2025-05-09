import * as React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { useWalletsFetch } from '../../../hooks';
import { selectWallets } from '../../../modules/user/wallets';
import { WalletBanner, WalletsButtons } from '../../components';
import { WalletsHistory } from '../WalletsHistory';

const SelectedWalletMobileScreen = ()  =>  {
    const { currency = '' } = useParams<{ currency?: string }>();
    const wallets = useSelector(selectWallets) || [];

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

export {
    SelectedWalletMobileScreen,
};
