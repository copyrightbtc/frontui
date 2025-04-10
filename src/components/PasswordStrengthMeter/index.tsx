import * as React from 'react';
import { passwordEntropyStep } from '../../api';
import { PasswordStrengthTip } from '../PasswordStrengthTip';

export interface PasswordStrengthMeterProps {
    currentPasswordEntropy: number;
    minPasswordEntropy: number;
    passwordExist: boolean;
    passwordErrorFirstSolved: boolean;
    passwordErrorSecondSolved: boolean;
    passwordErrorThirdSolved: boolean;
    passwordErrorForthSolved: boolean;
    passwordPopUp: boolean;
    translate: (id: string) => string;
}

const renderPasswordStrengthMeter = (props: PasswordStrengthMeterProps, passwordStrengthMeterLength: number) => (
    <div className="password-strength__container">
        <div className={`password-strength__container__block ${passwordStrengthClassName(passwordStrengthMeterLength)}`}></div>
        <div className={`password-strength__pop-up ${passwordStrengthClassName(passwordStrengthMeterLength)}`}>
            {passwordStrengthStatus(passwordStrengthMeterLength, props.translate)}
        </div>
    </div>
);

const renderPasswordStrengthTip = (props: PasswordStrengthMeterProps) =>
    props.passwordPopUp ? (
        <div className="password-strength__tips"> 
            <PasswordStrengthTip
                passwordErrorFirstSolved={props.passwordErrorFirstSolved}
                passwordErrorSecondSolved={props.passwordErrorSecondSolved}
                passwordErrorThirdSolved={props.passwordErrorThirdSolved}
                passwordErrorForthSolved={props.passwordErrorForthSolved}
                passwordPopUp={props.passwordPopUp}
                translate={props.translate}
            />
        </div>
    ) : null;

const passwordStrengthClassName = (passwordStrengthMeterLength: number) => {
    switch (passwordStrengthMeterLength) {
        case 0:
            return 'too-weak';
        case 1:
            return 'weak';
        case 2:
            return 'good';
        case 3:
            return 'strong';
        case 4:
            return 'very-strong';
        default:
            return 'too-weak';
    }
};

const passwordStrengthStatus = (passwordStrengthMeterLength: number, translate) => {
    switch (passwordStrengthMeterLength) {
        case 0:
            return translate('page.header.signUp.password.too.weak') || 'TOO WEAK';
        case 1:
            return translate('page.header.signUp.password.weak') || 'WEAK';
        case 2:
            return translate('page.header.signUp.password.good') || 'GOOD';
        case 3:
            return translate('page.header.signUp.password.strong') || 'STRONG';
        case 4:
            return translate('page.header.signUp.password.very.strong') || 'VERY STRONG';
        default:
            return translate('page.header.signUp.password.too.weak') || 'TOO WEAK';
    }
};

const PasswordStrengthMeterComponent: React.FC<PasswordStrengthMeterProps> = (props) => {
    const {
        passwordErrorSecondSolved,
        passwordErrorThirdSolved,
        passwordErrorFirstSolved,
        passwordErrorForthSolved,
        minPasswordEntropy,
        currentPasswordEntropy,
        passwordExist,
    } = props;

    const passwordComplite = passwordErrorSecondSolved && passwordErrorFirstSolved && passwordErrorThirdSolved && passwordErrorForthSolved;
    const AVG_PASSWORD_ENTROPY = minPasswordEntropy + passwordEntropyStep();
    const STRONG_PASSWORD_ENTROPY = minPasswordEntropy + passwordEntropyStep() * 2;

    let passwordStrengthMeterLength = -1;

    if (currentPasswordEntropy < minPasswordEntropy) {
        passwordStrengthMeterLength = 0;
    }

    if ((currentPasswordEntropy < minPasswordEntropy && passwordErrorFirstSolved) || passwordErrorFirstSolved) {
        passwordStrengthMeterLength = 1;
    }

    if (passwordComplite) {
        if (currentPasswordEntropy >= minPasswordEntropy && currentPasswordEntropy < AVG_PASSWORD_ENTROPY) {
            passwordStrengthMeterLength = 2;
        }

        if (currentPasswordEntropy >= AVG_PASSWORD_ENTROPY && currentPasswordEntropy < STRONG_PASSWORD_ENTROPY) {
            passwordStrengthMeterLength = 3;
        }

        if (currentPasswordEntropy >= STRONG_PASSWORD_ENTROPY) {
            passwordStrengthMeterLength = 4;
        }
    }

    return (
        <div className="password-strength">
            {passwordExist ? renderPasswordStrengthMeter(props, passwordStrengthMeterLength) : null}
            {passwordExist ? renderPasswordStrengthTip(props) : null} 
        </div>
    );
};

export const PasswordStrengthMeter = React.memo(PasswordStrengthMeterComponent);
