import * as React from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { Button } from '@mui/material';
import {
    selectUserInfo,
} from '../../../modules';

import { UserInfo } from '../../components';
import { ProfileChangePasswordMobileScreen, ProfileTwoFaScreen } from '../../screens';

const ProfileMobileScreenComponent: React.FC = () => {
    const intl = useIntl();
    const user = useSelector(selectUserInfo);

    return (
        <div className="mobile-profile-screen">
            <UserInfo />
            <ProfileChangePasswordMobileScreen />
            <ProfileTwoFaScreen />
            {user.level !== 3 ? <div className='mobile-user-info__level'>
                <h5>{intl.formatMessage({id: 'page.body.profile.header.account.profile'})}</h5>
                 
                <Button 
                    className='small-button' 
                    href='/profile/verification'
                >
                    Level {user.level}
                </Button>
            </div> : null}
        </div>
    );
};

export const ProfileMobileScreen = React.memo(ProfileMobileScreenComponent);
