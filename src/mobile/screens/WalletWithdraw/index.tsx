import * as React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { useWalletsFetch } from '../../../hooks';
import { selectWallets } from '../../../modules/user/wallets';
import { WalletBanner } from '../../components';
import { WalletsSpotMobile } from 'src/mobile/screens';


const defaultWallet = { name: '', currency: '', balance: '', type: '', address: '', fee: '' };

const WalletWithdraw: React.FC = () => {
    const { currency = '' } = useParams<{ currency?: string }>();
    const wallets = useSelector(selectWallets) || [];
    const wallet = wallets.find(item => item.currency === currency) || defaultWallet;

    useWalletsFetch();

    return (
        <div className="mobile-wallet">
            <WalletBanner wallet={wallet} />
            <WalletsSpotMobile currency={currency} action='withdraw'/> 
        </div>
    );
};

export {
    WalletWithdraw,
};
