import * as React from 'react';
import { injectIntl } from 'react-intl';
import { compose } from 'redux'; 
import { RouteProps, withRouter } from 'react-router-dom'; 
import { RouterProps } from 'react-router';
import { Footer, HeaderLanding } from '../../containers';
import { IntlProps } from '../../index';
import { CryptoIcon } from '../../components/CryptoIcon';
import { MemberFeesBlock } from './MemberFeesBlock';
import { setDocumentTitle } from '../../helpers';

import { API, RequestOptions } from '../../api';

const banktransfertwith = require('../../assets/images/paysystems/banktransfertwith.svg'); 
const payeerwith = require('../../assets/images/paysystems/payeerwith.svg');
const voletwidth = require('../../assets/images/paysystems/voletwith.svg');
 

export interface WithdrawProps {
    currency?: string;
    fee?: number;
    withdrawFeeLabel?: string;
    currencies: any; 
}

interface ReduxProps {
    isLoggedIn: boolean; 
}
 
interface LocationProps extends RouterProps {
    location: {
        pathname: string;
    };
}
type Props = ReduxProps & RouteProps & IntlProps & LocationProps;

const currenciesOptions: RequestOptions = {
    apiVersion: 'tradesfor',
};

class Landing extends React.Component<Props, WithdrawProps> {
    constructor(props){
        super(props);
        this.state = {
            currencies: null
        }
    }

    public async componentDidMount() { 
        setDocumentTitle(this.translate('page.body.feeslend.fee.setDocumentTitle'));
        const currencies = await API.get(currenciesOptions)('/public/currencies');
        this.setState({currencies})
    }
 
    public render () { 
        return (
            <div className="landing-screen">
                <HeaderLanding />
                <div className="landing-screen__features dark_mo">

                    <div className="terms_wrapper__feees">

                        <h2>{this.translate('page.body.feeslend.fee.h2')}</h2>
                        <div className="fees_table __makertak">
                            <h3>{this.translate('page.body.feeslend.fee.h31')}</h3>
                             <MemberFeesBlock />
                            <p>{this.translate('page.body.feeslend.fee.makandtake')}</p>
                            <p>{this.translate('page.body.feeslend.fee.makandtake2')}</p>
                            <p>{this.translate('page.body.feeslend.fee.makandtake3')}</p>
                            <p>{this.translate('page.body.feeslend.fee.makandtake4')}</p> 
                            <h3>{this.translate('page.body.feeslend.fee.h32')}</h3>
                            <p>{this.translate('page.body.feeslend.fee.pvolume')}</p> 
                            <p>{this.translate('page.body.feeslend.fee.pvolume2')}</p> 
                        </div>
                            
                        <div className="fees_table">
                        <h3>{this.translate('page.body.feeslend.fee.h33')}</h3>
                            
                            <div className="flex-container">
                                <div className="flex_4">
                                    <span>{this.translate('page.body.feeslend.fee.tablspan4')}</span>
                                </div>
                                <div className="flex_4">
                                    <span>{this.translate('page.body.feeslend.fee.tablspan5')}</span>
                                </div> 
                                <div className="flex_4">
                                    <span>{this.translate('page.body.feeslend.fee.tablspan6')}</span>
                                </div>
                                <div className="flex_4">
                                    <span>{this.translate('page.body.feeslend.fee.tablspan7')}</span>
                                </div> 
                            </div>
                            <div className="flex-container"> 
                                <div className="flex_4">
                                    <span className="currency-icon land-ticker-table__icons__image">
                                        <img src={banktransfertwith} alt=''/>
                                    </span>
                                    <span>{this.translate('page.body.feeslend.fee.tablspan8')}</span>
                                </div>
                                <div className="flex_4">
                                    <span>USD/EUR</span>
                                </div>
                                <div className="flex_4">
                                    <span>$300</span> 
                                </div>
                                <div className="flex_4">
                                    <span>0.1%</span>
                                </div> 
                            </div> 
                            <div className="flex-container">
                                <div className="flex_4">
                                    <span className="currency-icon land-ticker-table__icons__image">
                                        <img src={payeerwith} alt=''/> 
                                    </span>
                                    <span>Payeer</span>
                                </div>
                                <div className="flex_4">
                                    <span>Payeer</span>
                                </div>
                                <div className="flex_4">
                                    <span>$50.00</span> 
                                </div>
                                <div className="flex_4">
                                    <span>0.95%</span>
                                </div> 
                            </div>
                            <div className="flex-container">
                                <div className="flex_4">
                                    <span className="currency-icon land-ticker-table__icons__image">
                                        <img src={voletwidth} alt=''/>
                                    </span>
                                    <span>Volet</span>
                                </div>
                                <div className="flex_4">
                                    <span>Volet</span>
                                </div>
                                <div className="flex_4">
                                    <span>$50.00</span> 
                                </div>
                                <div className="flex_4">
                                    <span>0%</span>
                                </div> 
                            </div>
                            {this.state.currencies && this.state.currencies.map(currency =>
                                <div key={currency.id} className="flex-container">
                                    <div className="flex_4"> 
                                        <CryptoIcon className="land-ticker-table__icons__image" code={currency.id} /> 
                                    <span>{currency.name}</span>
                                    </div>
                                    <div className="flex_4"> 
                                        <span>{currency.id.toUpperCase()}</span>
                                    </div>
                                    <div className="flex_4">
                                        <span>{currency.min_deposit_amount}</span> 
                                    </div>
                                    <div className="flex_4">
                                        <span>{currency.deposit_fee}</span>
                                    </div> 
                                </div>
                            )}
                            <p>{this.translate('page.body.feeslend.fee.pdeposits')}</p>
                            <p>{this.translate('page.body.feeslend.fee.pdeposits2')}</p>
                        </div> 

                        <div className="fees_table">
                        <h3>{this.translate('page.body.feeslend.fee.h34')}</h3>
        
                            <div className="flex-container">
                                <div className="flex_4">
                                    <span>{this.translate('page.body.feeslend.fee.tablspan4')}</span>
                                </div>
                                <div className="flex_4">
                                    <span>{this.translate('page.body.feeslend.fee.tablspan5')}</span>
                                </div> 
                                <div className="flex_4">
                                    <span>{this.translate('page.body.feeslend.fee.tablspan6')}</span>
                                </div>
                                <div className="flex_4">
                                    <span>{this.translate('page.body.feeslend.fee.tablspan10')}</span>
                                </div> 
                            </div>
                            <div className="flex-container"> 
                                <div className="flex_4">
                                    <span className="currency-icon land-ticker-table__icons__image">
                                        <img src={banktransfertwith} alt=''/>
                                    </span>
                                    <span>{this.translate('page.body.feeslend.fee.tablspan8')}</span>
                                </div>
                                <div className="flex_4">
                                    <span>USD/EUR</span>
                                </div>
                                <div className="flex_4">
                                    <span>$300</span> 
                                </div>
                                <div className="flex_4">
                                    <span>0.1%</span>
                                </div> 
                            </div>
                            <div className="flex-container">
                                <div className="flex_4">
                                    <span className="currency-icon land-ticker-table__icons__image">
                                        <img src={payeerwith} alt=''/>
                                    </span>
                                    <span>Payeer</span>
                                </div>
                                <div className="flex_4">
                                    <span>Payeer</span>
                                </div>
                                <div className="flex_4">
                                    <span>$50.00</span> 
                                </div>
                                <div className="flex_4">
                                    <span>0.95%</span>
                                </div> 
                            </div>
                            <div className="flex-container">
                                <div className="flex_4">
                                    <span className="currency-icon land-ticker-table__icons__image">
                                        <img src={voletwidth} alt=''/>
                                    </span>
                                    <span>Volet</span>
                                </div>
                                <div className="flex_4">
                                    <span>Volet</span>
                                </div>
                                <div className="flex_4">
                                    <span>$50.00</span> 
                                </div>
                                <div className="flex_4">
                                    <span>{this.translate('page.body.feeslend.fee.tablspan9')}</span>
                                </div> 
                            </div>
                            {this.state.currencies && this.state.currencies.map(currency =>
                                <div className="flex-container">
                                    <div className="flex_4"> 
                                        <CryptoIcon className="land-ticker-table__icons__image" code={currency.id} /> 
                                    <span>{currency.name}</span>
                                    </div>
                                    <div className="flex_4">
                                        <span>{currency.id.toUpperCase()}</span>
                                    </div>
                                    <div className="flex_4">
                                        <span>{currency.min_withdraw_amount}</span>
                                    </div>
                                    <div className="flex_4">
                                        <span>{currency.withdraw_fee}</span>
                                    </div> 
                                </div>
                            )}
                            <p>{this.translate('page.body.feeslend.fee.pwithdraw')}</p>
                            <p>{this.translate('page.body.feeslend.fee.pwithdraw2')}</p>
                        </div>
                    </div>
                </div>
            <Footer />
            </div> 
        );
    }
 
    private translate = (key: string) => this.props.intl.formatMessage({id: key});
}

export const FeesPolicy = compose(
    injectIntl,
    withRouter,
)(Landing) as React.ComponentClass;
