import classnames from 'classnames';
import * as React from 'react';
import { Link, useLocation } from "react-router-dom";
import { useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import { CSSTransition } from "react-transition-group";
import { IconButton, Button } from '@mui/material';
import { DocumentsVerIcon } from "../../assets/images/DocumentsVerIcon";
import { CloseIcon } from '../../assets/images/CloseIcon';
import { selectUserLoggedIn, selectUserInfo } from '../../modules';
 
const handleGetActiveMenuClass = (currentRoute: string, targetRoute: string, absolute?: boolean) => {
    return classnames('p2pheader-menu__wrapper__nav', {
        'p2pheader-menu__wrapper__nav--active': absolute ? currentRoute === targetRoute : currentRoute.includes(targetRoute),
    });
};

export const AdvertisementMenu: React.FC = () => {
 
    const { pathname } = useLocation();
    const [showModal, setShowModal] = React.useState(false);
    const isLoggedIn = useSelector(selectUserLoggedIn);
    const intl = useIntl();
    const user = useSelector(selectUserInfo);

    return ( 
        <React.Fragment> 
            {isLoggedIn ? (
                <div className="p2pheader-menu">
                    <div className="p2pheader-menu__wrapper">
                        <div className="p2pheader-menu__wrapper__left">
                            <a href="/trading" className={handleGetActiveMenuClass(pathname, '/trading/')}>
                                {intl.formatMessage({ id: "page.body.header.up.titles.trading" })}
                            </a>
                            <a href="/p2p/all-adverts/" className={handleGetActiveMenuClass(pathname, '/p2p/')}>
                                P2P
                            </a>
                        </div>
                        <div className="p2pheader-menu__wrapper__right">
                            <a href="/p2p/all-adverts/" className={handleGetActiveMenuClass(pathname, '/p2p/all-adverts')}>
                                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 24 24"> 
                                    <path d="M14,11l5,4l-5,4v-3H5v-2h9V11z M10,5L5,9l5,4v-3h9V8h-9V5z M24,12c0,6.6-5.4,12-12,12S0,18.6,0,12S5.4,0,12,0 S24,5.4,24,12z M22,12c0-5.5-4.5-10-10-10S2,6.5,2,12s4.5,10,10,10S22,17.5,22,12z M14,14H5v2h9v3l5-4l-5-4V14z M10,8V5L5,9l5,4v-3 h9V8H10z M19,15l-5-4v3H5v2h9v3L19,15z M10,8V5L5,9l5,4v-3h9V8H10z"/>
                                </svg>
                                {intl.formatMessage({ id: "page.body.p2p.advertisement.content.alltrades" })}
                            </a>
                            <Link to={`/p2p/my-payments/${user.uid}`} className={handleGetActiveMenuClass(pathname, '/p2p/my-payments')}>
                                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 24 24"> 
                                    <path d="M12,0C5.4,0,0,5.4,0,12s5.4,12,12,12s12-5.4,12-12S18.6,0,12,0z M12,22C6.5,22,2,17.5,2,12S6.5,2,12,2 s10,4.5,10,10S17.5,22,12,22z M16.3,15c0,1-0.3,1.9-1,2.6c-0.5,0.6-1.3,0.9-2.2,1.1v1.6h-2.2v-1.6c-0.9-0.2-1.7-0.6-2.2-1.2 c-0.7-0.7-1-1.7-1-2.9v-0.5h2.5v0.5c0,0.6,0.1,1.1,0.5,1.4c0.3,0.3,0.7,0.5,1.3,0.5c0.6,0,1-0.1,1.4-0.4c0.3-0.2,0.4-0.6,0.4-1 c0-0.4-0.1-0.7-0.4-0.9c-0.3-0.3-0.8-0.6-1.6-0.8c-1.2-0.4-2.1-0.9-2.7-1.5c-0.6-0.7-0.9-1.5-0.9-2.5c0-1,0.3-1.9,0.9-2.5 c0.5-0.6,1.2-0.9,2-1.1V3.8h2.2v1.9c0.8,0.2,1.5,0.6,2,1.3c0.6,0.7,0.9,1.7,0.9,2.9v0.5h-2.5V9.9c0-0.6-0.1-1.2-0.4-1.5 C13,8,12.6,7.9,12.1,7.9c-0.5,0-0.9,0.1-1.1,0.4c-0.2,0.2-0.4,0.6-0.4,1c0,0.4,0.1,0.7,0.4,1c0.3,0.3,0.8,0.5,1.6,0.8 c0.9,0.3,1.6,0.6,2.1,1c0.5,0.4,0.9,0.8,1.2,1.3C16.1,13.8,16.3,14.3,16.3,15z"/> 
                                </svg>
                                {intl.formatMessage({ id: "page.body.p2p.advertisement.content.payments" })}
                            </Link>
                            <Link to="/p2p/orders" className={handleGetActiveMenuClass(pathname, '/p2p/orders')}>
                                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 24 24"> 
                                    <path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6 9h-12l6 8 6-8z"/>
                                </svg>
                                {intl.formatMessage({ id: "page.body.p2p.advertisement.content.orders" })}
                            </Link>
                            { user.level === 3 ? 
                                <Link to="/p2p/advertisements/create" className={handleGetActiveMenuClass(pathname, '/p2p/advertisements/create')}>
                                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 24 24"> 
                                        <path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6 13h-5v5h-2v-5h-5v-2h5v-5h2v5h5v2z"/>
                                    </svg>
                                    {intl.formatMessage({ id: "page.body.p2p.advertisement.action.new_ads" })}
                                </Link> : 
                                <div onClick={() => setShowModal(true)} className="p2pheader-menu__wrapper__nav">
                                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 24 24"> 
                                        <path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6 13h-5v5h-2v-5h-5v-2h5v-5h2v5h5v2z"/>
                                    </svg>
                                    {intl.formatMessage({ id: "page.body.p2p.advertisement.action.new_ads" })}
                                </div>
                            }
                            <Link to="/p2p/myads" className={handleGetActiveMenuClass(pathname, '/p2p/myads')}>
                                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 24 24"> 
                                    <path d="M12.3,5.6c-0.3-0.8,0.9-1.2,1.2-0.4l3.7,9.3c0.3,0.8-0.9,1.2-1.2,0.4c0,0-2.3-0.8-5.1,0.1l1.8,2.8 c0.2,0.3,0.1,0.7-0.3,0.8L11.2,19c-0.1,0-0.5,0.2-0.9-0.2L7.9,16c-1.7,0.5-3.6-0.4-3.6-2.3c0-0.9,0.5-1.8,1.6-2.4 C11.4,8.6,12.3,5.6,12.3,5.6z M16.2,6.2c1,0.4,1.8,1.2,2.2,2.3c0.4,1.1,0.4,2.2,0,3.2l1,0.4c0.3-0.6,0.4-1.3,0.4-2 c0-2.1-1.2-4-3.2-4.8L16.2,6.2z M15.6,7.8c0.6,0.2,1,0.7,1.3,1.3c0.3,0.6,0.2,1.3,0,1.8l0.9,0.4c0.3-0.8,0.4-1.7,0-2.6 c-0.4-0.9-1-1.5-1.8-1.9C15.9,6.9,15.6,7.8,15.6,7.8z M12,0C5.4,0,0,5.4,0,12s5.4,12,12,12s12-5.4,12-12S18.6,0,12,0z M12,22 C6.5,22,2,17.5,2,12S6.5,2,12,2s10,4.5,10,10S17.5,22,12,22z"/>
                                </svg>
                                {intl.formatMessage({ id: "page.body.p2p.advertisement.action.my_ads" })}
                            </Link>
                        </div>
                    </div>
                    <CSSTransition
                        in={showModal}
                        timeout={{
                        enter: 100,
                        exit: 400
                        }}
                        unmountOnExit
                    >
                        <div className="modal-window"> 
                            <div className="modal-window__container wide scroll fadet">
                                <div className="modal-window__container__header">
                                    <h1>{intl.formatMessage({ id: "page.body.p2p.advertisement.component.select_payments" })}</h1>
                                    <div className="modal-window__container__header__close">
                                        <IconButton 
                                            onClick={() => setShowModal(false)}
                                            sx={{
                                                color: 'var(--color-dark)',
                                                '&:hover': {
                                                    color: 'var(--color-accent)'
                                                }

                                            }}
                                        >
                                            <CloseIcon className="icon_closeed themes"/>
                                        </IconButton>
                                    </div>
                                </div>
                                <div className="payment-options__payment"> 
                                    <div className="payment-options__payment__title">{intl.formatMessage({ id: "page.body.p2p.advertisement.component.select_payments.verify" })}</div>
                                    <div className="payment-options__payment__step">
                                        <div className="left">
                                            <DocumentsVerIcon />
                                            <span>{intl.formatMessage({ id: "page.body.p2p.advertisement.component.select_payments.verify.span" })}</span>
                                        </div>
                                        <div className="right">
                                            <Button
                                                href='/profile'
                                                className="little-button themes"
                                            >   
                                                {intl.formatMessage({ id: 'page.body.p2p.advertisement.component.select_payments.verify.button' })}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                                <div className="p2p-modal__footer">
                                    <Button
                                        onClick={() => setShowModal(false)}
                                        className="medium-button themes black"
                                    >   
                                        {intl.formatMessage({ id: 'page.body.p2p.trade.create.close' })}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CSSTransition>
                </div>
            ) : null }
        </React.Fragment> 
    ); 
};
