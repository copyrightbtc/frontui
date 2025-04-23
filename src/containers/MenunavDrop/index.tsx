import classnames from 'classnames';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import { Link, useLocation } from 'react-router-dom';
import { Button, Menu } from '@mui/material';
import { ProfileMenuIcon } from '../../assets/images/ProfileMenuIcon';
import { VerifiedIcon } from 'src/assets/images/VerifiedIcon';
import { UnVerifiedIcon } from 'src/assets/images/UnVerifiedIcon';
import { LogoutIcon } from '../../assets/images/sidebar/LogoutIcon';
import { ProfileIcon } from '../../assets/images/sidebar/ProfileIcon';
import { RefferalIcon } from '../../assets/images/sidebar/RefferalIcon';
import { TradeIcon } from '../../assets/images/sidebar/TradeIcon';
import { OrderIcon } from '../../assets/images/sidebar/OrderIcon';
import { HistoryIcon } from '../../assets/images/sidebar/HistoryIcon';
import { ApikeysIcon } from '../../assets/images/sidebar/ApikeysIcon';
import { WalletIcon } from '../../assets/images/sidebar/WalletIcon';
import { P2PIcon } from '../../assets/images/sidebar/P2PIcon';
import { 
    logoutFetch,
    selectUserLoggedIn
} from '../../modules';
import { truncateEmail } from '../../helpers';
import { selectUserInfo } from '../../modules';

const handleGetActiveItemClass = (currentRoute: string, targetRoute: string, absolute?: boolean) => {
    return classnames('menunav-drop__menu__nav', {
        'menunav-drop__menu__nav--active': absolute ? currentRoute === targetRoute : currentRoute.includes(targetRoute),
    });
};

const noHeaderRoutesP2P = [
    '/p2p/',
];
const noHeaderRoutesTrading = [
    '/trading/',
];

const noHeaderRoutesClass = [
    '/p2p/',
    '/trading/',
    '/profile/',
];

export const MenunavDrop: React.FC = () => {
    const userLoggedIn = useSelector(selectUserLoggedIn);
    const shouldRenderLinkP2P = noHeaderRoutesP2P.some(r => location.pathname.includes(r));
    const shouldRenderLinkTrading = noHeaderRoutesTrading.some(r => location.pathname.includes(r));
    const shouldRenderClass = noHeaderRoutesClass.some(r => location.pathname.includes(r));
    const intl = useIntl();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
 
    const { pathname } = useLocation(); 
    const dispatch = useDispatch();
 
    const handleLogoutUser = () => {
        dispatch(logoutFetch());
    }; 
    const user = useSelector(selectUserInfo);
    
    return (
        <React.Fragment>
            <Button
                className="menunav-button"
                aria-controls={open ? 'menunav-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                variant="text"
            > 
                <ProfileMenuIcon />
            </Button>
 
            <Menu
                id="menunav-menu"
                className={`${!shouldRenderClass ? 'blackmenu menunav-drop__menu ' : 'menunav-drop__menu'}`}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <div className="menunav-drop__menu__userinfo">{truncateEmail(user.email)}</div>
                {userLoggedIn && <div className="profile-userinfo__verification"> 
                    { user.level === 1 ? ( 
                        <div className="profile-userinfo__verification__level-1">
                            <Button
                                href='/profile'
                                className="verif_level"
                            >
                                {intl.formatMessage({ id: 'page.body.profile.header.account.unverified' })}
                                <UnVerifiedIcon />
                            </Button> 
                        </div> 
                    ) : null }
                    { user.level === 2 ? ( 
                        <div className="profile-userinfo__verification__level-2">
                            <Button
                                href='/profile'
                                className="verif_level"
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
                {!shouldRenderLinkTrading ? (
                    <Link to="/trading" className={handleGetActiveItemClass(pathname, '/trading')}>
                        <TradeIcon className="nav-icon" />
                        <span className="nav-title">{intl.formatMessage({ id: 'page.body.header.up.titles.trading' })}</span>
                    </Link>
                    ) : null
                }
                {!shouldRenderLinkP2P ? (
                    <a href="/p2p/all-adverts/" className='menunav-drop__menu__nav'>
                        <P2PIcon className="nav-icon" />
                        <span className="nav-title">{intl.formatMessage({ id: 'page.body.header.up.titles.p2ptrading' })}</span>
                    </a>
                    ) : null
                }
                <Link to="/profile" className={handleGetActiveItemClass(pathname, '/profile')}>
                    <ProfileIcon className="nav-icon" />
                    <span className="nav-title">{intl.formatMessage({ id: 'page.body.header.up.titles.profilepage' })}</span>
                </Link>
                <Link to="/referral" className={handleGetActiveItemClass(pathname, '/referral')}>
                    <RefferalIcon className="nav-icon" />
                    <span className="nav-title">{intl.formatMessage({ id: 'page.body.header.up.titles.referralprogram' })}</span>
                </Link>
                <Link to="/wallets" className={handleGetActiveItemClass(pathname, '/wallets')}>
                    <WalletIcon className="nav-icon" />
                    <span className="nav-title">{intl.formatMessage({ id: 'page.body.header.up.titles.yourwallets' })}</span>
                </Link>
                <Link to="/orders" className={handleGetActiveItemClass(pathname, '/orders')}>
                    <OrderIcon className="nav-icon" />
                    <span className="nav-title">{intl.formatMessage({ id: 'page.body.header.up.titles.yourorders' })}</span>
                </Link>
                <Link to="/history" className={handleGetActiveItemClass(pathname, '/history')}>
                    <HistoryIcon className="nav-icon" />
                    <span className="nav-title">{intl.formatMessage({ id: 'page.body.header.up.titles.actionshistory' })}</span>
                </Link>
                <Link to="/apikeys" className={handleGetActiveItemClass(pathname, '/apikeys')}>
                    <ApikeysIcon className="nav-icon" />
                    <span className="nav-title">{intl.formatMessage({ id: 'page.body.header.up.titles.apikeys' })}</span>
                </Link> 
                <div className="logout-link" onClick={handleLogoutUser}> 
                    <LogoutIcon className="nav-icon" /> 
                    <span className="nav-title">{intl.formatMessage({id: 'page.body.profile.content.action.logout'})}</span>
                </div>
            </Menu>
        </React.Fragment>
    );
}

/*   <Link to="/quick-exchange" className={handleGetActiveItemClass(pathname, '/quick-exchange')}>
       <QExchangeIcon className="nav-icon" />
       <span className="nav-title">{intl.formatMessage({ id: 'page.body.header.up.titles.quickexchange' })}</span>
   </Link>*/