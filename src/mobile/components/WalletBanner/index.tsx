import * as React from 'react';
import { useIntl } from 'react-intl';
import { IconButton } from '@mui/material';
import { ArrowBackIcon } from 'src/assets/images/ArrowBackIcon';
import { Decimal } from '../../../components/Decimal';
import { areEqualSelectedProps } from '../../../helpers/areEqualSelectedProps';
import { CryptoIcon } from '../../../components/CryptoIcon';

interface Props {
    wallet: any;
    currency?: string;
    name?: string;
}

const WalletBannerComponent = (props: Props) => {
    const {
        wallet: {
            name,
            currency,
            balance = 0,
            locked = 0,
            fixed,
        },
    } = props;
    const intl = useIntl();

    const goBack = () => {
        window.history.back();
    }

    return (
        <div className="wallet-banner-mobile">
            <div className="wallet-banner-mobile__header"> 
                <div className="wallet-banner-mobile__close">
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
                <CryptoIcon code={currency.toUpperCase()} /> 
                <h5>{name}</h5> 
                <div className="balance">
                    <Decimal fixed={fixed} children={+(balance || 0) + +(locked || 0)} thousSep=","/>
                    <span>{currency.toUpperCase()}</span>
                </div>
                <div className="balances">
                    <div className="numbers">
                        <h6>{intl.formatMessage({ id: 'page.body.wallets.overview.header.available' })}</h6>
                        <Decimal fixed={fixed} children={balance || 0} thousSep=","/>
                    </div>
                    <div className="numbers">
                        <h6>{intl.formatMessage({ id: 'page.body.wallets.overview.header.locked' })}</h6>
                        <Decimal fixed={fixed} children={locked || 0} thousSep=","/>
                    </div>
                </div>
            </div>
        </div>
    );
};

const WalletBanner = React.memo(WalletBannerComponent, areEqualSelectedProps('wallet', ['balance', 'locked', 'currency', 'name', 'fixed']));

export {
    WalletBanner,
};
