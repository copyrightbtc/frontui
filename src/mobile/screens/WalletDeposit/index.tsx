import * as React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { useIntl } from 'react-intl';
import { IconButton } from '@mui/material';
import { ArrowBackIcon } from 'src/assets/images/ArrowBackIcon';
import { useWalletsFetch } from '../../../hooks';
import {
    selectWallets,
    Wallet,
} from '../../../modules/user/wallets';
import { WalletDepositBody } from '../../components';
import { DEFAULT_WALLET } from '../../../constants';

const WalletDeposit: React.FC = () => {
    const intl = useIntl();
    const { currency = '' } = useParams<{ currency?: string }>();
    const wallets = useSelector(selectWallets) || [];

    useWalletsFetch();

    const wallet: Wallet = wallets.find(item => item.currency === currency) || DEFAULT_WALLET;

    const goBack = () => {
        window.history.back();
    }

    return (
        <div className='mobile-wallet'>
            <div className="mobile-wallet--top__close">
                <IconButton 
                    onClick={goBack}
                    sx={{
                        width: '40px',
                        height: '40px',
                        color: 'var(--color-light-grey)',
                        '&:hover': {
                            color: 'var(--color-accent)'
                        }
                    }}
                >
                    <ArrowBackIcon /> 
                </IconButton>
                <p>{intl.formatMessage({ id: 'page.body.profile.content.back' })}</p>
            </div>
            <WalletDepositBody wallet={wallet}/>
        </div>
    );
};

export {
    WalletDeposit,
};
