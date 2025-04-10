import * as React from 'react';
import { useIntl } from 'react-intl'; 
import { useHistory } from 'react-router'; 
import { Subheader, PayeerpaymentBody } from '../../components';
 

 
const PayeerpaymentMobile: React.FC = () => {  
    const intl = useIntl();
    const history = useHistory(); 

    return (
        <React.Fragment>
            <Subheader
                title={intl.formatMessage({ id: 'page.body.wallets.tabs.deposit.Payeerpeys' })}
                backTitle={intl.formatMessage({ id: 'page.body.wallets.balance' })}
                onGoBack={() => history.push(`/wallets/usd/deposit`)}
            />  
            <PayeerpaymentBody />
        </React.Fragment>
    );
};
 
export {
    PayeerpaymentMobile,
};

