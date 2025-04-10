import * as React from 'react';
import { useIntl } from 'react-intl';
import OtpInput from "react-otp-input";
import IconButton from '@mui/material/IconButton';
import { CloseIcon } from '../../assets/images/CloseIcon';

export interface TwoFactorCustomAuthProps {
    errorMessage?: string;
    isLoading?: boolean; 
    title?: string;
    handleClose2fa?: () => void;
    message?: string;
    code: string;
    handleOtpCodeChange: (otp: string) => void;
}

export const TwoFactorAuthComponentCustom: React.FC<TwoFactorCustomAuthProps> = ({
    code,
    handleClose2fa,
    title,
    message, 
    handleOtpCodeChange,
}) => {
 
    const { formatMessage } = useIntl();
    
    return (
        <div className="twofa">
            <form className="twofa__form">
                <div className="twofa__form__header">
                    <h1>{ title || formatMessage({ id: 'page.body.profile.apiKeys.modal.header' })}</h1>
                    <div className="twofa__form__header__close">
                            <IconButton 
                                onClick={handleClose2fa}
                                sx={{
                                    color: '#fff',
                                    '&:hover': {
                                        color: 'var(--accent)'
                                    }

                                }}
                            >
                                <CloseIcon className="icon_closeed"/>
                            </IconButton>
                        </div>

                </div>
                <div className="twofa__form__content">
                    <div className="twofa__form__content__header">
                        {message || formatMessage({ id: 'page.mobile.twoFactorModal.subtitle' })}
                    </div>

                    <div className="twofa__form__content__body">
                        <OtpInput
                            inputType="number"
                            value={code}
                            onChange={handleOtpCodeChange}
                            numInputs={6}
                            renderSeparator={<span>-</span>}
                            shouldAutoFocus={true}
                            skipDefaultStyles={true}
                            inputStyle={{
                                caretColor: "var(--accent)"
                              }}
                            renderInput={(props) => <input {...props} />}
                        /> 
                    </div>
                </div>
            </form>
        </div>
    );
};

export const TwoFactorCustom = React.memo(TwoFactorAuthComponentCustom);
