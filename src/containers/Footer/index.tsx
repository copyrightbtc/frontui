import * as React from 'react';
import { injectIntl } from 'react-intl';
import { RouterProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { IntlProps } from '../../index';

//const TelegramIcon = require('../../assets/images/landing/social/Telegram.svg');
import FacebookIcon from '../../assets/images/landing/social/Facebook.svg';
import TwitterIcon from '../../assets/images/landing/social/Twitter.svg'; 
import LogoFooter from '../../assets/images/cybsec_logo.png';  

interface ReduxProps {
    configsLoading: boolean;
}

interface LocationProps extends RouterProps {
    location: {
        pathname: string;
    };
}

const noFooterRoutes = [
    '/confirm',
    '/404',
    '/500',
];

type FooterProps = LocationProps & ReduxProps & IntlProps;

class FooterComponent extends React.Component<FooterProps> {
    public render() {
        const { location, configsLoading } = this.props;
        const shouldRenderFooter = !noFooterRoutes.some(r => location.pathname.includes(r));

        const currentYear = new Date().getFullYear();

        if (!shouldRenderFooter || configsLoading) {
            return <React.Fragment />;
        }

        return (
            <React.Fragment>
            <div className="main_footer"> 
                <div className="main_footer__wrap"> 
                    <div className="main_footer__wrap__navigation">
                        <div className="main_footer__wrap__navigation__col">
                            <a href="/terms-of-use" target="_blank" rel="noopener noreferrer">{this.translate('page.body.landing.footer.terms')}</a>
                            <a href="/cookies-policy" target="_blank" rel="noopener noreferrer">{this.translate('page.body.landing.footer.cookies')}</a>
                            <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">{this.translate('page.body.landing.footer.privacy')}</a>
                            <a href="/amlkyc-policy" target="_blank" rel="noopener noreferrer">{this.translate('page.body.landing.footer.aml')}</a>
                        </div>
                        <div className="main_footer__wrap__navigation__col">   
                            <a href="https://sfortrade.zohodesk.eu/portal/en/home" target="_blank" rel="noopener noreferrer">{this.translate('page.body.landing.footer.faq')}</a>  
                            <a href="/fees">{this.translate('page.body.landing.footer.fees')}</a> 
                        </div>
                        <div className="main_footer__wrap__social__row"> 
                            <a href="https://twitter.com/SforTrade" target="_blank" rel="noopener noreferrer"><img src={TwitterIcon} alt="Twitter" />Follow Us on Twitter</a> 
                            <a href="https://www.facebook.com/SforTradeOfficial" target="_blank" rel="noopener noreferrer"><img src={FacebookIcon} alt="Facebook" />Like Us on Facebook</a>
                        </div>
                        <div className="main_footer__wrap__navigation__col">
                            <a href="mailto:support@sfor.trade">support@sfor.trade</a>
                            <p>{this.translate('page.body.landing.footer.community')}</p>
                            <p>{this.translate('page.body.landing.footer.info')}</p> 
                        </div>
                    </div>
                </div>
                <span className="main_footer__rights"><p>Copyright © {currentYear} SFOR.TRADE {this.translate('page.body.landing.footer.rights')}</p><a href="https://cybsecgroup.com" target="_blank" rel="noopener noreferrer">C.S.G Team <img src={LogoFooter} alt="CybSecGroup Logo"/></a></span>
            </div>
            </React.Fragment>
        );
    }

    public translate = (key: string) => this.props.intl.formatMessage({id: key});
}

export const Footer = compose(
    injectIntl,
    withRouter
)(FooterComponent) as React.ComponentClass;
