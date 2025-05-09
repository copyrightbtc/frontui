import * as React from 'react';
import { useSelector } from 'react-redux';
import { Button } from '@mui/material';
import { useIntl } from 'react-intl';
import { ModalMobile } from '../../components/ModalMobile';
import { is2faValid, truncateEmail } from 'src/helpers';
import { CloseIcon } from '../../../assets/images/CloseIcon';
import { TwoFactorCustom } from '../../../components';
import { selectUserInfo } from '../../../modules';

export const TwoFactorModalComponent = props => {
    const [code2FA, setCode2FA] = React.useState('');
    const intl = useIntl();
    const user = useSelector(selectUserInfo); 

    const handleToggle2FA = shouldFetch => {
        props.handleToggle2FA(code2FA, shouldFetch);
        setCode2FA('');
    };

    const renderModalHeader = (
        <div className="mobile-modal__header">
            <div className="mobile-modal__header-title">
                {intl.formatMessage({ id: 'page.body.profile.apiKeys.modal.header' })}
            </div>
            <div className="mobile-modal__header-close" onClick={() => handleToggle2FA(false)}>
                <CloseIcon />
            </div>
        </div>
    );

    return (
        <ModalMobile
            header={renderModalHeader}
            isOpen={props.showModal}
            onClose={props.showModal}
        > 
            <div className="mobile-modal-2fa">
                <TwoFactorCustom
                    handleClose2fa={props.showModal}
                    code={code2FA}
                    handleOtpCodeChange={setCode2FA}
                    title={intl.formatMessage({ id: 'page.body.profile.content.twofascreen.modalHeader'})}
                />
                <div className="mobile-modal-2fa__info"> 
                    {intl.formatMessage({ id: 'page.body.profile.content.twofascreen.userinfo'})}{truncateEmail(user.email)}
                </div>
                <div className="mobile-modal-2fa__danger"> 
                    {intl.formatMessage({ id: 'page.body.profile.content.twofascreen.userinfo.note'})}
                </div>
                <div className="mobile-modal__button">
                    <Button
                        className='medium-button'
                        disabled={!is2faValid(code2FA)}
                        onClick={() => handleToggle2FA(true)}
                    >
                        {intl.formatMessage({id: 'page.body.profile.content.twofascreen.disable'})}
                    </Button>
                </div>
            </div>
        </ModalMobile>
    );
};

export const TwoFactorModal = React.memo(TwoFactorModalComponent);
