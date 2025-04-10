import classnames from 'classnames';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom'; 
import { LogoutIcon } from '../../assets/images/sidebar/LogoutIcon';
import { ProfileIcon } from '../../assets/images/sidebar/ProfileIcon';
import { RefferalIcon } from '../../assets/images/sidebar/RefferalIcon';
import { TradeIcon } from '../../assets/images/sidebar/TradeIcon';
import { OrderIcon } from '../../assets/images/sidebar/OrderIcon';
import { HistoryIcon } from '../../assets/images/sidebar/HistoryIcon';
import { ApikeysIcon } from '../../assets/images/sidebar/ApikeysIcon';
import { WalletIcon } from '../../assets/images/sidebar/WalletIcon';
//import { QExchangeIcon } from '../../assets/images/sidebar/QExchangeIcon';
import { P2PIcon } from '../../assets/images/sidebar/P2PIcon';
import { logoutFetch } from '../../modules'; 

const biglogo = require('../../assets/images/logoLight.svg').default;
 
const handleGetActiveItemClass = (currentRoute: string, targetRoute: string, absolute?: boolean) => {
    return classnames('accountpage-wrapper__left__nav', {
        'accountpage-wrapper__left__nav--active': absolute ? currentRoute === targetRoute : currentRoute.includes(targetRoute),
    });
};
 

const LeftHeaderComponent: React.FC = () => { 
    const { pathname } = useLocation();
    const intl = useIntl();
    const dispatch = useDispatch();
 
    const handleLogoutUser = () => {
        dispatch(logoutFetch());
    }; 

    return (
        <div className="accountpage-wrapper__left">
            <div className="accountpage-wrapper__left__logo">
                <Link to="/" className={handleGetActiveItemClass(pathname, '/', true)}>
                    <img src={biglogo} alt="Logo" />
                </Link> 
            </div> 

            <Link to="/trading" className={handleGetActiveItemClass(pathname, '/trading')}>
                <TradeIcon className="nav-icon" />
                <span className="nav-title">{intl.formatMessage({id: 'page.header.navbar.trade'})}</span>
            </Link>
            <a href="/p2p/all-adverts/" className="accountpage-wrapper__left__nav">
                <P2PIcon className="nav-icon" />
                <span className="nav-title">P2P</span>
            </a>
            <Link to="/profile" className={handleGetActiveItemClass(pathname, '/profile')}>
                <ProfileIcon className="nav-icon" />
                <span className="nav-title">{intl.formatMessage({id: 'page.header.navbar.profile'})}</span>
            </Link>
            <Link to="/referral" className={handleGetActiveItemClass(pathname, '/referral')}>
                <RefferalIcon className="nav-icon" />
                <span className="nav-title">{intl.formatMessage({id: 'page.header.navbar.referral'})}</span>
            </Link>
            <Link to="/wallets" className={handleGetActiveItemClass(pathname, '/wallets')}>
                <WalletIcon className="nav-icon" />
                <span className="nav-title">{intl.formatMessage({id: 'page.header.navbar.wallets'})}</span>
            </Link>
            <Link to="/orders" className={handleGetActiveItemClass(pathname, '/orders')}>
                <OrderIcon className="nav-icon" />
                <span className="nav-title">{intl.formatMessage({id: 'page.header.navbar.openOrders'})}</span>
            </Link>
            <Link to="/history" className={handleGetActiveItemClass(pathname, '/history')}>
                <HistoryIcon className="nav-icon" />
                <span className="nav-title">{intl.formatMessage({id: 'page.header.navbar.history'})}</span>
            </Link>
            <Link to="/apikeys" className={handleGetActiveItemClass(pathname, '/apikeys')}>
                <ApikeysIcon className="nav-icon" />
                <span className="nav-title">{intl.formatMessage({id: 'page.header.navbar.apikeys'})}</span>
            </Link> 
            <div className="logout-link" onClick={handleLogoutUser}> 
                <LogoutIcon className="nav-icon" /> 
                <span className="nav-title">{intl.formatMessage({id: 'page.body.profile.content.action.logout'})}</span>
            </div>
        </div>
    );

};
 
export const Sidebar = React.memo(LeftHeaderComponent);