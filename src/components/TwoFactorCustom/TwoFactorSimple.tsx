import * as React from 'react';
import OtpInput from "react-otp-input";

export interface TwoFactorCustomProps {
    errorMessage?: string;
    isLoading?: boolean; 
    code: string;
    handleOtpCodeChange: (otp: string) => void;
}

export const TwoFactorSimpleComponent: React.FC<TwoFactorCustomProps> = ({
    code, 
    handleOtpCodeChange,
}) => { 

    return (
        <div className="twofa">
            <form className="twofa__form">
                <div className="twofa__form__content"> 
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

export const TwoFactorSimple = React.memo(TwoFactorSimpleComponent);
