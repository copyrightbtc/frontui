import * as React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { ChangePassword } from '../../../components';
import { ModalMobile } from '../../components';
import { Button } from '@mui/material';
import {
    changePasswordFetch,
    entropyPasswordFetch,
    selectCurrentPasswordEntropy,
 } from '../../../modules';
import { CloseIcon } from '../../../assets/images/CloseIcon';

const PasswordIcon = require('src/assets/images/PasswordIcon.svg').default;

const ChangePasswordScreenComponent: React.FC = () => {
    const dispatch = useDispatch();
    const [isOpenModal, setOpenModal] = React.useState(false);
    const intl = useIntl();
    const handleChangePassword = payload => {
        if (payload) {
            dispatch(changePasswordFetch(payload));
            setOpenModal(false);
        }
    };

    const fetchCurrentPasswordEntropy = payload => {
        if (payload) {
            dispatch(entropyPasswordFetch(payload));
        }
    };

    const currentPasswordEntropy = useSelector(selectCurrentPasswordEntropy);

    const renderModalHeader = (
        <div className="mobile-modal__header">
            <div className="mobile-modal__header-title">
                {intl.formatMessage({ id: 'page.body.profile.header.account.content.password.change' })}
            </div>
            <div className="mobile-modal__header-close" onClick={() => setOpenModal(false)}>
                <CloseIcon />
            </div>
        </div>
    );

    return (
        <div className='mobile-user-info'>
            <div className="mobile-user-info__row">
                <img src={PasswordIcon} alt="PasswordIcon" draggable="false" />
                <div className="mobile-user-info__row__withbuttons">
                    <div className="column">
                        <h5>{intl.formatMessage({ id: 'page.body.profile.header.account.content.password'})}</h5>
                        <p>
                            ************
                        </p> 
                    </div>
                    <Button
                        className="small-button"
                        onClick={() => setOpenModal(!isOpenModal)}
                    >
                        {intl.formatMessage({ id: 'page.body.profile.header.account.content.password.button.change'})}
                    </Button>
                </div>
            </div>
            <ModalMobile
                header={renderModalHeader}
                isOpen={isOpenModal}
                onClose={() => setOpenModal(!isOpenModal)}
            > 
                <ChangePassword
                    handleChangePassword={handleChangePassword}
                    currentPasswordEntropy={currentPasswordEntropy}
                    fetchCurrentPasswordEntropy={fetchCurrentPasswordEntropy}
                />
            </ModalMobile>
        </div>
    );
};

export const ProfileChangePasswordMobileScreen = React.memo(ChangePasswordScreenComponent);
