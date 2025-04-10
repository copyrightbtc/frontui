import * as React from 'react';
import { Zoom, styled } from '@mui/material';
import { OverlayTrigger } from 'react-bootstrap';
import { InfoIcon } from 'src/assets/images/InfoIcon';
import { Tooltip, Decimal } from '../../components';

export interface PasswordStrengthTipProps {
    passwordErrorFirstSolved: boolean;
    passwordErrorSecondSolved: boolean;
    passwordErrorThirdSolved: boolean;
    passwordErrorForthSolved: boolean;
    passwordPopUp: boolean;
    translate: (id: string) => string;
}

const PasswordStrengthTipComponent: React.FC<PasswordStrengthTipProps> = ({
    passwordErrorFirstSolved,
    passwordErrorSecondSolved,
    passwordErrorThirdSolved,
    passwordErrorForthSolved,
    translate,
}) =>
    !(passwordErrorFirstSolved && passwordErrorSecondSolved && passwordErrorThirdSolved && passwordErrorForthSolved) ? (
        <div className={'password-strength__tips__tip'}>
            {!passwordErrorFirstSolved && (
                <span className="password-strength__tips__tip-text">{translate('password.strength.tip.number.characters')}
                    <OverlayTrigger
                        placement="auto"
                        delay={{ show: 250, hide: 300 }}
                        overlay={<Tooltip title="page.header.signUp.strength.onlysymbols" />}>
                            <div className="tip_icon_container">
                                <InfoIcon />
                            </div>
                    </OverlayTrigger>
                </span>
            )}
            {!passwordErrorSecondSolved && (
                <span className="password-strength__tips__tip-text">{translate('password.strength.tip.letter')}</span>
            )}
            {!passwordErrorThirdSolved && (
                <span className="password-strength__tips__tip-text">{translate('password.strength.tip.lowercase')}</span>
            )}
            {!passwordErrorForthSolved && (
                <span className="password-strength__tips__tip-text">{translate('password.strength.tip.digit')}</span>
            )}
        </div>
    ) : null;

export const PasswordStrengthTip = React.memo(PasswordStrengthTipComponent);
