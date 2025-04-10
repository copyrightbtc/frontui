import React, { useCallback } from 'react';
import { useIntl } from 'react-intl';
import {
    ProfileAccountActivity, 
    ProfileVerification,
    ProfileSecurity,
    Sidebar,
    ProfileHeader,
    UserLevelInfo,
} from 'src/containers';
import { useDocumentTitle } from 'src/hooks';

interface ParamType {
    fixed: number;
}

export const ProfileScreen = React.memo((props: ParamType) => {
    const { formatMessage } = useIntl();

    const translate = useCallback((id: string) => formatMessage({ id }), [formatMessage]);

    useDocumentTitle(translate('page.header.navbar.profile'));

 
    return (
        <div className="accountpage-wrapper">
            <Sidebar />
            <div className="accountpage-wrapper__right">
                <ProfileHeader />
                <div className="profile-page">
                    <UserLevelInfo fixed={props.fixed} /> 
                    <ProfileAccountActivity />
                    <ProfileSecurity />
                    <ProfileVerification /> 
                </div> 
            </div>
        </div>
    );
});
