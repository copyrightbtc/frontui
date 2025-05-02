import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { ProfileTwoFactorAuth } from '../../../containers/ProfileTwoFactorAuth';
import { selectUserInfo, toggle2faFetch } from '../../../modules/user/profile';
import { TwoFactorModal } from '../../components';

const TwoFaIcon = require('src/assets/images/TwoFaIcon.svg').default;
const TwoFaIconEnabled = require('src/assets/images/TwoFaIconEnabled.svg').default;

export const ProfileTwoFaScreen: React.FC = React.memo(() => {
    const [showModal, setShowModal] = React.useState(false);
    const dispatch = useDispatch();
    const history = useHistory();
    const user = useSelector(selectUserInfo);

    const handleToggle2FA = (code2FA, shouldFetch) => {
        if (shouldFetch) {
            dispatch(toggle2faFetch({
                code: code2FA,
                enable: false,
            }));
        }
        setShowModal(false);
    };

    const handleNavigateTo2fa = React.useCallback((enable2fa: boolean) => {
        if (enable2fa) {
            history.push('/profile/2fa', { enable2fa: true });
        } else {
            setShowModal(state => !state);
        }
    }, []);

    return (
        <div className='mobile-user-info'>
            <div className="mobile-user-info__row">
                {!user.otp ? <img src={TwoFaIcon} alt="2fa" draggable="false" /> : <img src={TwoFaIconEnabled} alt="2fa" draggable="false" /> }
                <div className="mobile-user-info__row__withbuttons">
                    <ProfileTwoFactorAuth 
                        is2faEnabled={user.otp} 
                        navigateTo2fa={handleNavigateTo2fa}
                    /> 
                </div>
                <TwoFactorModal
                    showModal={showModal}
                    handleToggle2FA={handleToggle2FA}
                />
            </div>
        </div>
    );
});
