import classnames from 'classnames';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { Button, Drawer } from '@mui/material';
import { CloseIcon } from 'src/assets/images/CloseIcon';
import { MenuIcon } from 'src/assets/images/MenuIcon';
import { VerifiedIcon } from 'src/assets/images/VerifiedIcon';
import { UnVerifiedIcon } from 'src/assets/images/UnVerifiedIcon';
import { LogoutIcon } from 'src/assets/images/sidebar/LogoutIcon';
import { ProfileIcon } from 'src/assets/images/sidebar/ProfileIcon';
import { RefferalIcon } from 'src/assets/images/sidebar/RefferalIcon';
import { TradeIcon } from 'src/assets/images/sidebar/TradeIcon';
import { OrderIcon } from 'src/assets/images/sidebar/OrderIcon';
import { HistoryIcon } from 'src/assets/images/sidebar/HistoryIcon';
import { ApikeysIcon } from 'src/assets/images/sidebar/ApikeysIcon';
import { SupportIcon } from 'src/assets/images/SupportIcon';
import { WalletIcon } from 'src/assets/images/sidebar/WalletIcon';
import { P2PIcon } from 'src/assets/images/sidebar/P2PIcon';
import { ThemeSwitch } from './ThemeSwitch';
import { LangugesCont } from './LangugesCont';
import { 
    logoutFetch,
    selectUserLoggedIn
} from 'src/modules';
import { truncateEmail } from 'src/helpers';
import { selectUserInfo } from 'src/modules';

const LogoImage = require('../../assets/images/biglogo.svg').default;

const handleGetActiveItemClass = (currentRoute: string, targetRoute: string, absolute?: boolean) => {
    return classnames('menunav-mobile__nav', {
        'menunav-mobile__nav--active': absolute ? currentRoute === targetRoute : currentRoute.includes(targetRoute),
    });
};

const HeaderComponent: React.FC = () => {
    const userLoggedIn = useSelector(selectUserLoggedIn);
    const intl = useIntl();

    const [open, setOpen] = React.useState(false);

    const toggleDrawer = (newOpen) => () => {
      setOpen(newOpen);
    };

    const { pathname } = useLocation(); 
    const dispatch = useDispatch();
 
    const handleLogoutUser = () => {
        dispatch(logoutFetch());
    }; 
    const user = useSelector(selectUserInfo);

    return (
        <div className="mobile-header">
            <Link className="mobile-header__logo" to="/"> 
                <img src={LogoImage} alt="SFOR.TRADE Logo"/>
            </Link>
            <React.Fragment>
                <div className='icon-button' onClick={toggleDrawer(true)}>
                    <MenuIcon className='menunav-mobile-button' />
                </div>
    
                <Drawer
                    className='menunav-mobile'
                    anchor='right'
                    open={open}
                    onClose={toggleDrawer(false)}
                    role="presentation"
                >
                    <div className='menunav-mobile__inner'>
                        <div className='menunav-mobile__header'>
                            <div className='icon-button' onClick={toggleDrawer(false)}>
                                <CloseIcon className='menunav-mobile-button' />
                            </div>
                        </div>
                        {userLoggedIn ? <div className="menunav-mobile__userinfo">{truncateEmail(user.email)}</div> : 
                            <div className="menunav-mobile__userinfo__buttons">
                                <Link className='simple-button dark' to="/signin" onClick={toggleDrawer(false)}>
                                    {intl.formatMessage({id: 'page.body.landing.header.login'})}
                                </Link>
                                <Link className='simple-button' to="/signup" onClick={toggleDrawer(false)}>
                                    {intl.formatMessage({id: 'page.body.land.button.register'})}
                                </Link>
                            </div> }
                        {userLoggedIn && <div className="profile-userinfo__verification"> 
                            { user.level === 1 ? ( 
                                <div className="profile-userinfo__verification__level-1">
                                    <Button
                                        href='/profile/verification'
                                        className="verif_level"
                                        onClick={toggleDrawer(false)}
                                    >
                                        {intl.formatMessage({ id: 'page.body.profile.header.account.unverified' })}
                                        <UnVerifiedIcon />
                                    </Button> 
                                </div> 
                            ) : null }
                            { user.level === 2 ? ( 
                                <div className="profile-userinfo__verification__level-2">
                                    <Button
                                        href='/profile/verification'
                                        className="verif_level"
                                        onClick={toggleDrawer(false)}
                                    >   
                                        {intl.formatMessage({ id: 'page.body.profile.header.account.finishVerification' })}
                                        <UnVerifiedIcon /> 
                                    </Button>
                                </div> 
                            ) : null}

                            { user.level === 3 ? ( 
                                <div className="profile-userinfo__verification__level-3">
                                    <div className="verified">
                                        <VerifiedIcon className='ver-icon themes'/> 
                                        {intl.formatMessage({ id: 'page.body.profile.header.account.verified' })}  
                                    </div>
                                </div> 
                            ) : null}
                        </div>}
                        <div className='menunav-mobile__body'> 
                            <Link onClick={toggleDrawer(false)} to="/trading" className={handleGetActiveItemClass(pathname, '/trading')}>
                                <TradeIcon className="nav-icon" />
                                <span className="nav-title">{intl.formatMessage({ id: 'page.body.header.up.titles.trading' })}</span>
                            </Link>
                            <a onClick={toggleDrawer(false)} href="/p2p/all-adverts/" className='menunav-mobile__nav'>
                                <P2PIcon className="nav-icon" />
                                <span className="nav-title">{intl.formatMessage({ id: 'page.body.header.up.titles.p2ptrading' })}</span>
                            </a>
                            <Link onClick={toggleDrawer(false)} to="/profile" className={handleGetActiveItemClass(pathname, '/profile')}>
                                <ProfileIcon className="nav-icon" />
                                <span className="nav-title">{intl.formatMessage({ id: 'page.body.header.up.titles.profilepage' })}</span>
                            </Link>
                            <Link onClick={toggleDrawer(false)} to="/referral" className={handleGetActiveItemClass(pathname, '/referral')}>
                                <RefferalIcon className="nav-icon" />
                                <span className="nav-title">{intl.formatMessage({ id: 'page.body.header.up.titles.referralprogram' })}</span>
                            </Link>
                            <Link onClick={toggleDrawer(false)} to="/wallets" className={handleGetActiveItemClass(pathname, '/wallets')}>
                                <WalletIcon className="nav-icon" />
                                <span className="nav-title">{intl.formatMessage({ id: 'page.body.header.up.titles.yourwallets' })}</span>
                            </Link>
                            <Link onClick={toggleDrawer(false)} to="/orders" className={handleGetActiveItemClass(pathname, '/orders')}>
                                <OrderIcon className="nav-icon" />
                                <span className="nav-title">{intl.formatMessage({ id: 'page.body.header.up.titles.yourorders' })}</span>
                            </Link>
                            <Link onClick={toggleDrawer(false)} to="/history" className={handleGetActiveItemClass(pathname, '/history')}>
                                <HistoryIcon className="nav-icon" />
                                <span className="nav-title">{intl.formatMessage({ id: 'page.body.header.up.titles.actionshistory' })}</span>
                            </Link>
                            <Link onClick={toggleDrawer(false)} to="/apikeys" className={handleGetActiveItemClass(pathname, '/apikeys')}>
                                <ApikeysIcon className="nav-icon" />
                                <span className="nav-title">{intl.formatMessage({ id: 'page.body.header.up.titles.apikeys' })}</span>
                            </Link>
                            <ThemeSwitch />
                            <LangugesCont />
                            <a className="menunav-mobile__nav" href="https://sfortrade.zohodesk.eu/portal/en/newticket" target="_blank" rel="noopener noreferrer">
                                <SupportIcon className="nav-icon" />
                                <span className="nav-title">{intl.formatMessage({ id: 'page.body.landing.button.helpcenter' })}</span>
                            </a>
                            {userLoggedIn && <div className="menunav-mobile__nav logout" onClick={handleLogoutUser && toggleDrawer(false)}> 
                                <LogoutIcon className="nav-icon" /> 
                                <span className="nav-title">{intl.formatMessage({id: 'page.body.profile.content.action.logout'})}</span>
                            </div>}
                        </div>
                    </div>
                </Drawer>
            </React.Fragment>
        </div>
    );
};

export const Header = React.memo(HeaderComponent);
