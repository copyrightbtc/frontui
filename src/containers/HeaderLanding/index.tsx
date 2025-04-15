import * as React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useIntl } from 'react-intl'; 
import { selectUserLoggedIn } from '../../modules';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { LangDrop, SupportDrop, MenunavDrop } from '../../containers';

const LogoImage = require('../../assets/images/biglogo.svg').default;
 
const noHeaderRoutes = [
    '/signin',
    '/signup',
    '/forgot_password',
    '/email-verification',
    '/accounts/password_reset',
    '/accounts/confirmation',
    '/security/twofa-authenticator',
];

export const HeaderLanding: React.FC = () => {
 
    const intl = useIntl(); 
    const isLoggedIn = useSelector(selectUserLoggedIn);
    const shouldRenderHeader = noHeaderRoutes.some(r => location.pathname.includes(r)) && location.pathname !== '/';

    return (
        <header className="top-header">
            <Link className="top-header__left" to="/"> 
                <img src={LogoImage} alt="SFOR.TRADE Logo"/>
            </Link>
            <div className="top-header__right">
                {!shouldRenderHeader ? (
                    !isLoggedIn && 
                    <div className="top-header__right__buttons">
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
                                className="withborder"
                                variant="outlined"
                                href="/p2p/all-adverts/"
                            >
                                {intl.formatMessage({id: 'page.body.header.up.titles.p2ptrading'})}
                            </Button> 
                        </Stack>
                    </div>
                ) : null}
                { isLoggedIn && <MenunavDrop /> }
                <SupportDrop />
                <LangDrop />
            </div>
        </header>
    );
}
