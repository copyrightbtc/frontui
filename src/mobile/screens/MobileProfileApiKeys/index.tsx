import * as React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import {
    usernameFetch,
 } from '../../../modules';
import { Subheader } from '../../components';
import { SetUsername } from '../../../components/SetUsername';

const SetUsernameScreenComponent: React.FC = () => {
    const dispatch = useDispatch();
    const intl = useIntl();
    const history = useHistory();
4
    const handleSetUsername = payload => {
        if (payload) {
            dispatch(usernameFetch(payload));
            history.push('/profile');
        }
    };

    return (
        <React.Fragment>
            <Subheader
                title={intl.formatMessage({ id: 'page.body.profile.username.title' })}
                backTitle={intl.formatMessage({ id: 'page.body.profile.header.account' })}
                onGoBack={() => history.push('/profile')}
            />
            <div className="pg-mobile-profile-change-password-screen">
                <SetUsername
                    handleSetUsername={handleSetUsername}
                />
            </div>
        </React.Fragment>
    );
};

export const ProfileSetUsernameMobileScreen = React.memo(SetUsernameScreenComponent);
