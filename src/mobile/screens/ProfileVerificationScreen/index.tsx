import * as React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router';
import { useSelector } from 'react-redux';
import { ProfileVerification } from '../../../containers/ProfileVerification';
import { IconButton } from '@mui/material';
import { ArrowBackIcon } from 'src/assets/images/ArrowBackIcon';
import { selectUserInfo } from 'src/modules';

export const ProfileVerificationMobileScreen: React.FC = () => {
    const intl = useIntl();
    const history = useHistory();

    const user = useSelector(selectUserInfo);

    const levelTitle = (user) => {
        if (user.level === 1) {
            return <span><FormattedMessage id="page.body.profile.account.level.description.levelone" /></span>;
        } else if (user.level === 2) {
            return <span><FormattedMessage id="page.body.profile.account.level.description.leveltwo" /></span>;
        } else if (user.level === 3) {
            return <span><FormattedMessage id="page.body.profile.account.level.description.levelthree" /></span>;
        }
    };

    return (
        <div className="mobile-profile-verification">
            <div className="mobile-profile-verification__header"> 
                <div className="mobile-profile-verification__close">
                    <IconButton
                        onClick={() => history.push('/profile')}
                        sx={{
                            width: '40px',
                            height: '40px',
                            color: 'var(--color-light-grey)',
                            '&:hover': {
                                color: 'var(--color-accent)'
                            }
                        }}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                    <p>{intl.formatMessage({ id: 'page.body.profile.content.back' })}</p>
                </div>
                <h1>{intl.formatMessage({ id: 'page.body.profile.header.account.profile' })}</h1>
            </div>
            <div className="mobile-profile-verification__body">
                <p>{levelTitle(user)}</p>
            </div>
            <ProfileVerification />
        </div>
    );
};
