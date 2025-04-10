import * as React from 'react';
import { Button } from '@mui/material';
import { useIntl } from 'react-intl';
import OtpInput from "react-otp-input";

export interface TwoFactorSubmitProps {
    errorMessage?: string;
    isLoading?: boolean;
    onSubmit?: () => void;
    title: string;
    message?: string;
    code: string;
    codeFocused?: boolean;
    handleOtpCodeChange: (otp: string) => void;
    handleClose2fa?: () => void;
}

const noLoginRoutes = [
    '/signin',
];
const shouldRenderLoginRoutes = noLoginRoutes.some(r => location.pathname.includes(r));

export const TwoFactorSubmitComponent: React.FC<TwoFactorSubmitProps> = ({
    code,
    errorMessage,
    isLoading,
    title,
    message,
    onSubmit,
    handleOtpCodeChange,
    handleClose2fa,
}) => {
 
    const handleEnterPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter') {
            if (event.key === 'Enter' && code.length >= 6) {
                event.preventDefault();
                onSubmit();
            }
        }
    };

    const { formatMessage } = useIntl();
    

    return (
        <div className="twofa" onKeyPress={handleEnterPress}>
            <form className="twofa__form">
                <div className="twofa__form__header">
                    <h1>{ title || formatMessage({ id: 'page.body.profile.apiKeys.modal.header' })}</h1>
                </div>
                <div className="twofa__form__content">
                    <div className="twofa__form__content__header">{message || formatMessage({ id: 'page.mobile.twoFactorModal.subtitle' })}</div>
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
                    {errorMessage && <div className="twofa__form__error">{errorMessage}</div>}
                    <div className="twofa__form__content__button">
                        <Button
                            className={shouldRenderLoginRoutes ? "big-button" : "medium-button"}
                            disabled={isLoading || !code.match(`^[0-9]{6}$`)}
                            onClick={onSubmit}
                        >
                            {formatMessage({ id: 'page.body.kyc.submit' })}
                        </Button>
                    </div>
                    {shouldRenderLoginRoutes && <div className="twofa__form__content__footer">
                        <div className="simple_link" onClick={handleClose2fa}>{formatMessage({ id: 'page.header.signIn.backLogin' })}</div> 
                    </div>}
                </div>
            </form>
        </div>
    );
};

export const TwoFactorSubmit = React.memo(TwoFactorSubmitComponent);
