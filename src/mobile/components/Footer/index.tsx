import classnames from 'classnames';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { Link, useLocation } from 'react-router-dom';
import { OrderIcon } from 'src/assets/images/sidebar/OrderIcon';
import { ProfileIcon } from 'src/assets/images/sidebar/ProfileIcon';
import { TradeIcon } from 'src/assets/images/sidebar/TradeIcon';
import { WalletIcon } from 'src/assets/images/sidebar/WalletIcon';

const handleGetActiveItemClass = (currentRoute: string, targetRoute: string, absolute?: boolean) => {
    return classnames('mobile-footer-buttons__item', {
        'mobile-footer-buttons__item--active': absolute ? currentRoute === targetRoute : currentRoute.includes(targetRoute),
    });
};

const FooterComponent: React.FC = () => {
    const { pathname } = useLocation();
    const intl = useIntl();

    return (
        <div className="mobile-footer-buttons">
            <Link to="/orders" className={handleGetActiveItemClass(pathname, '/orders')}>
                <div className="footer-icon">
                    <OrderIcon />
                </div>
                <span className="footer-title">{intl.formatMessage({id: 'page.mobile.footer.orders'})}</span>
            </Link>
            <Link to="/trading" className={handleGetActiveItemClass(pathname, '/trading')}>
                <div className="footer-icon">
                    <TradeIcon />
                </div>
                <span className="footer-title">{intl.formatMessage({id: 'page.mobile.footer.trading'})}</span>
            </Link>
            <Link to="/wallets" className={handleGetActiveItemClass(pathname, '/wallets')}>
                <div className="footer-icon">
                    <WalletIcon />
                </div>
                <span className="footer-title">{intl.formatMessage({id: 'page.mobile.footer.wallets'})}</span>
            </Link>
            <Link to="/profile" className={handleGetActiveItemClass(pathname, '/profile')}>
                <div className="footer-icon">
                    <ProfileIcon />
                </div>
                <span className="footer-title">{intl.formatMessage({id: 'page.mobile.footer.profile'})}</span>
            </Link>
        </div>
    );
};

export const Footer = React.memo(FooterComponent);
