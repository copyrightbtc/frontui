import * as React from 'react'; 
import { useIntl } from 'react-intl';
import { selectUserInfo } from '../../../modules/user/profile';
import { useSelector } from 'react-redux';
import NumericInput from 'react-numeric-input';

const volet = require('src/assets/images/paysystems/volet_w.svg');

function myFormat(num) {
    return num + '$';
}
const VoletpaymentComponent = props => { 
    const intl = useIntl(); 
    const user = useSelector(selectUserInfo); 
 
    return (
    <div className="koinalpays __mobile"> 
        <div className="container"> 

        <img src={volet} alt="Volet Logo"/>
 
                <div className="tabContent_inner">
                    <div className="submitsystem-pay_inner">
                        
                        <form action="https://www.sfor.trade/merchant/advcash/index.php" method="post">
                        <div className="submitsystem-pay_wrapper">
                                <div>
                            <input type="hidden" value="USD" />
                                    <NumericInput 
                                        className="input_sum"
                                        type="number"
                                        id="amount"
                                        name="amount"
                                        placeholder="USD Amount"
                                        min={50} 
                                        max={999999} 
                                        format={myFormat}
                                    /> 
                                    <input
                                        type={'hidden'} 
                                        name="email"
                                        value={user.email}
                                    />  
                                </div>
        
                            <button className="btn submit" type="submit">{intl.formatMessage({ id: 'deposit.with.ewallets.button.deposit' })}</button>
        
                        </div>
                        </form> 


                </div> 
                <h3>{intl.formatMessage({ id: 'page.body.profile.volet.h3' })}</h3>
                    <div className="tabContent_inner-last">
 
                        <ul>
                            <h4>{intl.formatMessage({ id: 'page.body.profile.voletMob' })}</h4>
                            <li>{intl.formatMessage({ id: 'page.body.profile.voletMob1' })}</li>
                            <li>{intl.formatMessage({ id: 'page.body.profile.volet7' })}</li>
                            <li>{intl.formatMessage({ id: 'page.body.profile.volet8' })}</li>
                            <li>{intl.formatMessage({ id: 'page.body.profile.volet9' })}</li>
                            <li>{intl.formatMessage({ id: 'page.body.profile.volet10' })}</li>
                            <li>{intl.formatMessage({ id: 'page.body.profile.volet11' })}</li>
                            <li>{intl.formatMessage({ id: 'page.body.profile.volet12' })}</li>
                            <li>{intl.formatMessage({ id: 'page.body.profile.volet13' })}</li>
                            <li>{intl.formatMessage({ id: 'page.body.profile.volet4' })}</li>
                        </ul>
                    
                        <h3>{intl.formatMessage({ id: 'page.body.profile.volet0' })}</h3>
                        <ul> 
                            <li>{intl.formatMessage({ id: 'page.body.profile.volet1' })}</li>
                            <li>{intl.formatMessage({ id: 'page.body.profile.volet2' })}</li>
                            <li>{intl.formatMessage({ id: 'page.body.profile.volet3' })}</li> 
                            <li>{intl.formatMessage({ id: 'page.body.profile.volet5' })}</li>  
                        </ul> 
                    </div>

                    </div>
 
        </div>
    </div>
   );
  
}; 
 
const VoletpaymentBody = React.memo(VoletpaymentComponent);

export {
    VoletpaymentBody,
};

