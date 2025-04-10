import * as React from 'react'; 
import { useIntl } from 'react-intl';
import { selectUserInfo } from '../../../modules/user/profile';
import { useSelector } from 'react-redux';
import NumericInput from 'react-numeric-input';

const payeer = require('src/assets/images/paysystems/payeer_w.svg'); 
 
function myFormat(num) {
    return num + '$';
}
const PayeerpaymentComponent = props => { 
    const intl = useIntl(); 
    const user = useSelector(selectUserInfo); 
 
    return (
    <div className="koinalpays __mobile"> 
        <div className="container"> 

        <img src={payeer} alt="Payeer Logo"/>
 
                <div className="tabContent_inner">
                    <div className="submitsystem-pay_inner">
                        
                    <form action="https://www.sfor.trade/merchant/payeer/index.php" method="post">
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
                <h3>{intl.formatMessage({ id: 'page.body.profile.payeer.h3' })}</h3>
                    <div className="tabContent_inner-last">
                        <ul>
                            <h4>{intl.formatMessage({ id: 'page.body.profile.PayeercashMob' })}</h4>
                            <li>{intl.formatMessage({ id: 'page.body.profile.PayeercashMob1' })}</li>
                            <li>{intl.formatMessage({ id: 'page.body.profile.payeer2' })}</li>
                            <li>{intl.formatMessage({ id: 'page.body.profile.payeer3' })}</li>
                            <li>{intl.formatMessage({ id: 'page.body.profile.payeer4' })}</li>
                            <li>{intl.formatMessage({ id: 'page.body.profile.payeer5' })}</li>
                            <li>{intl.formatMessage({ id: 'page.body.profile.payeer6' })}</li>
                            <li>{intl.formatMessage({ id: 'page.body.profile.payeer7' })}</li>
                        </ul>
                        <h3>{intl.formatMessage({ id: 'page.body.profile.payeer8' })}</h3>
                        <ul>  
                        <li>{intl.formatMessage({ id: 'page.body.profile.volet1' })}</li>
                        <li>{intl.formatMessage({ id: 'page.body.profile.payeer9' })}</li>
                        <li>{intl.formatMessage({ id: 'page.body.profile.payeer10' })}</li>
                        <li>{intl.formatMessage({ id: 'page.body.profile.payeer11' })}</li>
                        <li>{intl.formatMessage({ id: 'page.body.profile.payeer12' })}</li>
                        </ul> 
                    </div>

                    </div>
 
        </div>
    </div>
   );
  
}; 
 
const PayeerpaymentBody = React.memo(PayeerpaymentComponent);

export {
    PayeerpaymentBody,
};


