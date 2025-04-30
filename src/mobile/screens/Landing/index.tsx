import * as React from 'react';
import { useSelector } from 'react-redux';
import { useIntl } from 'react-intl'; 
import { MarketsTable, Footer } from '../../../containers';
import { SmallTelegram } from '../../../assets/images/SmallTelegram';
import { SmallChat } from '../../../assets/images/SmallChat';
import { CandleRed } from '../../../assets/images/CandleRed';
import { selectUserLoggedIn } from '../../../modules';
import { setDocumentTitle } from '../../../helpers';
import Button from '@mui/material/Button';
 
const tradeImage = require('src/assets/images/trade.svg').default;
const shieldImage = require('src/assets/images/shield.svg').default;
const sysSecur = require('src/assets/images/curSecur.png').default;
const shield = require('src/assets/images/shield.png').default; 
const tradeLast = require('src/assets/images/tradelast.svg').default;
const tradeLastHand = require('src/assets/images/tradelastHand.svg').default;
const tradeCandle1 = require('src/assets/images/tradeCandle1.svg').default;
const tradeCandle2 = require('src/assets/images/tradeCandle2.svg').default;
const tradeCandle3 = require('src/assets/images/tradeCandle3.svg').default;
const tradeCandle4 = require('src/assets/images/tradeCandle4.svg').default; 

export const LandingScreenMobile: React.FC = () => {
    const intl = useIntl();
    const isLoggedIn = useSelector(selectUserLoggedIn);
    React.useEffect(() => {
        setDocumentTitle(intl.formatMessage({id: 'page.body.landingmine.marketInfo.title.text1'}))
     }, []);

    return (
        <div className="landing-screen">
            <div className="landing-screen__InfosBlock">
                { isLoggedIn ? (
                    <Button
                        className="medium-button"
                        href="/trading"
                    >
                        {intl.formatMessage({id: 'page.body.landing.marketInfo.title.button2'})}
                    </Button> 
                ) : (
                    <Button
                        className="medium-button"
                        href="/signin"
                    >
                        {intl.formatMessage({id: 'page.body.landing.marketInfo.title.button'})}
                    </Button> 
                )}
                <div className="landing-screen__up_containerfirst">
                    <div className="landing-screen__main_description"> 
                        <h1>{intl.formatMessage({id: 'page.body.landingmine.marketInfo.title.text1'})}</h1>
                        <span>{intl.formatMessage({id: 'page.body.landingmine.marketInfo.titleh2.text1'})}</span> 
                        <span>{intl.formatMessage({id: 'page.body.landingmine.marketInfo.titleh2.text2'})}</span>
                    </div> 
                </div>
                <div className="landing-screen__down_containerfirst"> 
                    <div className="container_cryptolist">  
                        <MarketsTable />  
                    </div> 
                </div>
            </div>
            <div className="landing-screen__section">
                <div className="landing-screen__section__wrap _upsect"> 
                    <div className="image-container">
                        <div className="image-container__inner">
                            <img src={tradeImage} alt=''/>
                            <img className="image-container__inner__up-1" src={tradeCandle1} alt=''/>
                            <img className="image-container__inner__up-2" src={tradeCandle2} alt=''/>
                            <img className="image-container__inner__up-3" src={tradeCandle3} alt=''/>
                            <img className="image-container__inner__up-4" src={tradeCandle4} alt=''/>
                            <div className="image-container__inner__up-red"><CandleRed /></div> 
                        </div>
                    </div> 
                    <div className="descript-container">
                        <h2>{intl.formatMessage({id: 'page.body.landing.section.descript.title_1'})}</h2>
                        <p>{intl.formatMessage({id: 'page.body.landing.section.descript_1'})}</p>
                        <p>{intl.formatMessage({id: 'page.body.landing.section.descript_2'})}</p>
                        <p>{intl.formatMessage({id: 'page.body.landing.section.descript_3'})}</p>
                        <p>{intl.formatMessage({id: 'page.body.landing.section.descript_4'})}</p>
                        <p>{intl.formatMessage({id: 'page.body.landing.section.descript_5'})}</p>
                    </div> 
                </div>
                <div className="landing-screen__section__wrap __backgr-img">
                    <div className="descript-container">
                        <h2>{intl.formatMessage({id: 'page.body.landing.section.descript.title_2'})}</h2>
                        <p>{intl.formatMessage({id: 'page.body.landing.section.descript_6'})}</p>
                        <p>{intl.formatMessage({id: 'page.body.landing.section.descript_7'})}</p>
                        <p>{intl.formatMessage({id: 'page.body.landing.section.descript_8'})}</p>
                        <p>{intl.formatMessage({id: 'page.body.landing.section.descript_9'})}</p>
                        <p>{intl.formatMessage({id: 'page.body.landing.section.descript_10'})}</p>
                        <p>{intl.formatMessage({id: 'page.body.landing.section.descript_11'})}</p>
                    </div>
                    <div className="image-container"> 
                        <div className="image-container__inner"> 
                            <img className="image-container__inner__first" src={sysSecur} alt=''/>
                            <img className="image-container__inner__second" src={shield} alt=''/>
                        </div>
                    </div>
                </div> 
                <div className="landing-screen__section__wrap __center">
                    <img src={shieldImage} alt=''/>
                    <h3>{intl.formatMessage({id: 'page.body.landing.section.descript.title_3'})}</h3>
                    <h3>{intl.formatMessage({id: 'page.body.landing.section.descript.title_4'})}</h3>
                        <ul>
                            <li>{intl.formatMessage({id: 'page.body.landing.section.descript_12'})}</li>
                            <li>{intl.formatMessage({id: 'page.body.landing.section.descript_13'})}</li>
                            <li>{intl.formatMessage({id: 'page.body.landing.section.descript_14'})}</li> 
                            <li>{intl.formatMessage({id: 'page.body.landing.section.descript_16'})}</li>
                            <li>{intl.formatMessage({id: 'page.body.landing.section.descript_17'})}</li>
                            <li>{intl.formatMessage({id: 'page.body.landing.section.descript_18'})}</li>
                            <li>{intl.formatMessage({id: 'page.body.landing.section.descript_19'})}</li>
                            <li>{intl.formatMessage({id: 'page.body.landing.section.descript_20'})}</li>
                            <li>{intl.formatMessage({id: 'page.body.landing.section.descript_21'})}</li>
                            <li>{intl.formatMessage({id: 'page.body.landing.section.descript_22'})}</li> 
                        </ul> 
                </div>
                <div className="landing-screen__section__wrap __backgr">
                    <div className="image-container">
                        <div className="image-container__inner"> 
                            <img className="image-container__inner__first" src={tradeLast} alt=''/> 
                            { isLoggedIn ? (
                                <Button
                                    className="medium-button"
                                    href="/trading"
                                >
                                    {intl.formatMessage({id: 'page.body.header.up.titles.trading'})}
                                </Button> 
                            ) : (
                                <Button
                                    className="medium-button"
                                    href="/signin"
                                >
                                    {intl.formatMessage({id: 'page.body.landing.marketInfo.title.button'})}
                                </Button> 
                            )}
                            <img className="image-container__inner__second" src={tradeLastHand} alt=''/>
                        </div>                      
                    </div>
                    <div className="descript-container">
                        <h2>{intl.formatMessage({id: 'page.body.landing.section.descript.title_5'})}</h2>
                        <p>{intl.formatMessage({id: 'page.body.landing.section.descript_24'})}</p>
                        <p>{intl.formatMessage({id: 'page.body.landing.section.descript_25'})}</p> 
                        <p>{intl.formatMessage({id: 'page.body.landing.section.descript_26'})}</p> 
                        <p>{intl.formatMessage({id: 'page.body.landing.section.descript_27'})}</p> 
                    </div>
                </div> 
                <div className="landing-screen__section__wrap __last"> 
                    <div className="descript-container">
                        <h3>{intl.formatMessage({id: 'page.body.landing.section.descript.title_6'})}</h3>
                        <span>{intl.formatMessage({id: 'page.body.landing.section.descript_28'})}</span> 
                        <span>{intl.formatMessage({id: 'page.body.landing.section.descript_29'})}</span> 
                    </div>
                    <div className="help-container">
                        <a href="https://sfortrade.zohodesk.eu/portal/en/newticket" className="help-container__button" target="_blank" rel="noopener noreferrer">
                            {intl.formatMessage({id: 'page.body.landing.button.helpcenter'})}
                            <SmallChat />
                        </a>
                        <a href="https://t.me/SFORTRADE_Support_bot" className="help-container__button" target="_blank" rel="noopener noreferrer">
                            Telegram
                            <SmallTelegram />
                        </a> 
                    </div>
                </div> 
            </div>
            <Footer />
        </div>
    ); 

}
 