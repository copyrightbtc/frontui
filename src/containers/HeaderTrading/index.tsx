import * as React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useIntl } from 'react-intl'; 
import { selectUserLoggedIn } from '../../modules';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { LangDrop, SupportDrop, MenunavDrop, ThemeSwitcher, TabGridModeSwitcher } from '../../containers';

const LogoImage = require('../../assets/images/biglogo.svg').default;
  
const noHeaderRoutes = [
    '/trading',
];

export interface FixedTab {
    content: React.ReactNode;
    disabled?: boolean;
    hidden?: boolean;
    label: string;
    icon?: React.ReactNode;
}

interface Props {
    showChartSettings?: boolean;
}

export const HeaderTrading: React.FC<Props> = ({ showChartSettings } : Props) => {
    const intl = useIntl();
    const isLoggedIn = useSelector(selectUserLoggedIn);
    const shouldRenderHeader = noHeaderRoutes.some(r => location.pathname.includes(r)) && location.pathname !== '/';

    return (
        <header className={`header-trading${shouldRenderHeader ? ' trading_style' : ''}`}>
            <Link className="header-trading__left" to="/"> 
                <img src={LogoImage} alt="SFOR.TRADE Logo"/>
            </Link>
            <div className="header-trading__right"> 
                { !isLoggedIn ? (
                    <div className="header-trading__right__buttons">
                        <Stack direction="row" spacing={2}>
                            <Button
                                variant="text"
                                href="/signin"
                            >
                                {intl.formatMessage({id: 'page.body.landing.header.login'})}
                            </Button>
                            <Button
                                href="/signup"
                                variant="outlined"
                            >
                                {intl.formatMessage({id: 'page.body.land.button.register'})}
                            </Button>
                            <Button
                                href="/p2p/all-adverts/"
                                variant="outlined"
                            >
                                {intl.formatMessage({id: 'page.body.header.up.titles.p2ptrading'})}
                            </Button>
                        </Stack>
                    </div>
                ) : null }
                <SupportDrop /> 
                <LangDrop />
                { isLoggedIn && <MenunavDrop /> }
                { showChartSettings && <TabGridModeSwitcher /> }
                <ThemeSwitcher />
            </div>
        </header>
    );
}