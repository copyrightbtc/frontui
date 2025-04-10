import * as React from 'react';
import { useIntl } from 'react-intl'; 
import { useHistory } from 'react-router'; 
import { Subheader, VoletpaymentBody } from '../../components';
 
const VoletpaymentMobile: React.FC = () => {  
    const intl = useIntl();
    const history = useHistory(); 

    return (
        <React.Fragment>
            <Subheader
                title={intl.formatMessage({ id: 'page.body.wallets.tabs.deposit.Volets' })}
                backTitle={intl.formatMessage({ id: 'page.body.wallets.balance' })}
                onGoBack={() => history.push(`/wallets/usd/deposit`)}
            />  
            <VoletpaymentBody />
        </React.Fragment>
    );
};
 
export {
    VoletpaymentMobile,
};
