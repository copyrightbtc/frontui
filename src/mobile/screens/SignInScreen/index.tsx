import classnames from 'classnames';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { selectSignInRequire2FA } from '../../../modules/user/auth';
import { SignInScreen } from '../../../screens/SignInScreen';

const SignInMobileScreen: React.FC = () => {
    const require2FA = useSelector(selectSignInRequire2FA);
    const className = classnames({
        'mobile-signin': !require2FA,
        'mobile-signin mobile-signin--kyc': require2FA,
    });

    return <div className={className}>
        <SignInScreen/>
    </div>;
};

export {
    SignInMobileScreen,
};
