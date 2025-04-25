import * as React from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router';
import { ChangeForgottenPasswordScreen } from '../../../screens/ChangeForgottenPasswordScreen';
import { ModalMobile } from '../../components';


const ChangeForgottenPasswordMobileScreen: React.FC = () => {
    const history = useHistory();
    const intl = useIntl();

    return <div>
        <ModalMobile
            isOpen={true}
            onClose={() => history.push('/trading')}
            title={intl.formatMessage({ id: 'page.header.signIn.resetPassword.title' })}>
            <ChangeForgottenPasswordScreen/>
        </ModalMobile>
    </div>;
};

export {
    ChangeForgottenPasswordMobileScreen,
};
