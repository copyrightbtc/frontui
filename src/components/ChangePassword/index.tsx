import cr from 'classnames';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import { Button, IconButton } from '@mui/material';
import { CloseIcon } from '../../assets/images/CloseIcon';
import { passwordMinEntropy } from '../../api/config';
import {
    PASSWORD_REGEX,
    passwordErrorFirstSolution,
    passwordErrorSecondSolution,
    passwordErrorThirdSolution,
    passwordErrorForthSolution,
    truncateEmail,
} from '../../helpers';
import { IconInput } from '../IconInput';
import { selectUserInfo } from '../../modules';
import { PasswordStrengthMeter } from '../index';

import { NoVisible } from '../../assets/images/customization/NoVisible';
import { Visible } from '../../assets/images/customization/Visible';

export const ChangePasswordComponent = props => {
    const [oldPassword, setOldPassword] = React.useState('');
    const [newPassword, setNewPassword] = React.useState('');
    const [confirmationPassword, setConfirmationPassword] = React.useState('');
    const [oldPasswordFocus, setOldPasswordFocus] = React.useState(false);
    const [newPasswordFocus, setNewPasswordFocus] = React.useState(false);
    const [confirmPasswordFocus, setConfirmPasswordFocus] = React.useState(false);
    const [passwordErrorFirstSolved, setPasswordErrorFirstSolved] = React.useState(false);
    const [passwordErrorSecondSolved, setPasswordErrorSecondSolved] = React.useState(false);
    const [passwordErrorThirdSolved, setPasswordErrorThirdSolved] = React.useState(false);
    const [passwordErrorForthSolved, setpasswordErrorForthSolved] = React.useState(false);
    const [passwordPopUp, setPasswordPopUp] = React.useState(false);

    const intl = useIntl();
    const user = useSelector(selectUserInfo); 

    const [passwordShown, setPasswordShown] = React.useState(false);
    const [passwordShownSecond, setPasswordShownSecond] = React.useState(false);
    const [passwordShownThird, setPasswordShownThird] = React.useState(false);

    const togglePasswordVisiblity = () => {
        setPasswordShown(passwordShown ? false : true);
    };
    const togglePasswordVisiblitySecond = () => { 
        setPasswordShownSecond(passwordShownSecond ? false : true);
    };
    const togglePasswordVisiblityThird = () => {
        setPasswordShownThird(passwordShownThird ? false : true);
    };

    const handleChangePassword = () => {
        const payload = props.hideOldPassword
        ? {
            password: newPassword,
            confirm_password: confirmationPassword,
        } : {
            old_password: oldPassword,
            new_password: newPassword,
            confirm_password: confirmationPassword,
        };

        props.handleChangePassword(payload);

        setOldPassword('');
        setNewPassword('');
        setConfirmationPassword('');
        setOldPasswordFocus(false);
        setNewPasswordFocus(false);
        setConfirmPasswordFocus(false);
    };

    const handleEnterPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();

            if (isValidForm()) {
                handleChangePassword();
            }
        }
    };

    const handleChangeNewPassword = (value: string) => {
        if (passwordErrorFirstSolution(value) && !passwordErrorFirstSolved) {
            setPasswordErrorFirstSolved(true);
        } else if (!passwordErrorFirstSolution(value) && passwordErrorFirstSolved) {
            setPasswordErrorFirstSolved(false);
        }

        if (passwordErrorSecondSolution(value) && !passwordErrorSecondSolved) {
            setPasswordErrorSecondSolved(true);
        } else if (!passwordErrorSecondSolution(value) && passwordErrorSecondSolved) {
            setPasswordErrorSecondSolved(false);
        }

        if (passwordErrorThirdSolution(value) && !passwordErrorThirdSolved) {
            setPasswordErrorThirdSolved(true);
        } else if (!passwordErrorThirdSolution(value) && passwordErrorThirdSolved) {
            setPasswordErrorThirdSolved(false);
        }

        if (passwordErrorForthSolution(value) && !passwordErrorForthSolved) {
            setpasswordErrorForthSolved(true);
        } else if (!passwordErrorForthSolution(value) && passwordErrorForthSolved) {
            setpasswordErrorForthSolved(false);
        }

        setNewPassword(value);
        setTimeout(() => {
            props.fetchCurrentPasswordEntropy({ password: value });
        }, 500);
    };

    const handleFocusNewPassword = () => {
        setNewPasswordFocus(!newPassword);
        setPasswordPopUp(!passwordPopUp);
    };

    const translate = (key: string) => intl.formatMessage({id: key});

    const isValidForm = () => {
        const isNewPasswordValid = newPassword.match(PASSWORD_REGEX);
        const isConfirmPasswordValid = newPassword === confirmationPassword;
        const isOldPasswordValid = (!props.hideOldPassword && oldPassword) || true;

        return isOldPasswordValid && isNewPasswordValid && isConfirmPasswordValid;
    };


    const oldPasswordClass = cr('login-form__content__group', {
        'login-form__content__group--focused': oldPasswordFocus,
    });

    const newPasswordClass = cr('login-form__content__group', {
        'login-form__content__group--focused': newPasswordFocus,
    });

    const confirmPasswordClass = cr('login-form__content__group', {
        'login-form__content__group--focused': confirmPasswordFocus,
    }); 
    
    return (
        <div className="login-form" onKeyPress={handleEnterPress}>
            <div className="login-form__content"> 
                {!props.hideOldPassword ? (
                <div className="change-pass__header">
                    <h1>{props.title}</h1>
                    <div className="change-pass__header__close">
                        <IconButton 
                            onClick={props.closeModal}
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
                </div> ) : (
                    <h1>{props.title}</h1>
                )}
                <div className="change-pass__title">
                    {!props.hideOldPassword ? (
                        <React.Fragment>{intl.formatMessage({id: 'page.body.profile.header.account.content.password.button.userinfo'})}<br/>{truncateEmail(user.email)}</React.Fragment>
                    ) : (
                        <React.Fragment>{intl.formatMessage({id: 'page.body.profile.header.account.content.password.button.userinfo.email'})}</React.Fragment>
                    )}
                </div> 
                {!props.hideOldPassword &&
                    <div className={oldPasswordClass}>
                        <IconInput
                            type={passwordShown ? "text" : "password"}
                            placeholder={intl.formatMessage({id: 'page.body.profile.header.account.content.password.old'})}
                            handleChangeInput={setOldPassword}
                            inputValue={oldPassword}
                            handleFocusInput={() => setOldPasswordFocus(!oldPasswordFocus)}
                            classNameInput="login-form__input"
                            autoFocus={true}
                            maxLength={30}
                        />
                        <svg className="iconfrom" version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 50 50">
                            <path d="M25,27.7c-0.7,0-1.3,0.6-1.3,1.3v8c0,0.7,0.6,1.3,1.3,1.3c0.7,0,1.3-0.6,1.3-1.3v-8
                                C26.3,28.3,25.7,27.7,25,27.7z M39.7,41c0,1.5-1.2,2.7-2.7,2.7l-24,0c-1.5,0-2.7-1.2-2.7-2.7V25c0-1.5,1.2-2.7,2.7-2.7l24,0
                                c1.5,0,2.7,1.2,2.7,2.7V41z M15.7,15.7c0-5.2,4.2-9.3,9.3-9.3s9.3,4.2,9.3,9.3v4H15.7V15.7z M37,19.7v-4c0-6.6-5.4-12-12-12
                                c-6.6,0-12,5.4-12,12v4c-2.9,0-5.3,2.4-5.3,5.3l0,16v5.3H13h24h5.3V41V25C42.3,22.1,39.9,19.7,37,19.7z"/>
                        </svg> 
                        <IconButton 
                            onClick={togglePasswordVisiblity}
                            className={passwordShown ? "passvisible" : "passnovisible"}
                            >{passwordShown ? <Visible /> : <NoVisible  />}
                        </IconButton> 
                    </div>
                }
                <div className={newPasswordClass}>
                    <IconInput
                        type={passwordShownSecond ? "text" : "password"}
                        placeholder={intl.formatMessage({id: 'page.body.profile.header.account.content.password.new'})}
                        handleChangeInput={handleChangeNewPassword}
                        inputValue={newPassword}
                        handleFocusInput={handleFocusNewPassword}
                        classNameInput="login-form__input"
                        autoFocus={false}
                        maxLength={30}
                    />
                    <svg className="iconfrom" version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 50 50">
                        <path d="M25,27.7c-0.7,0-1.3,0.6-1.3,1.3v8c0,0.7,0.6,1.3,1.3,1.3c0.7,0,1.3-0.6,1.3-1.3v-8
                            C26.3,28.3,25.7,27.7,25,27.7z M39.7,41c0,1.5-1.2,2.7-2.7,2.7l-24,0c-1.5,0-2.7-1.2-2.7-2.7V25c0-1.5,1.2-2.7,2.7-2.7l24,0
                            c1.5,0,2.7,1.2,2.7,2.7V41z M15.7,15.7c0-5.2,4.2-9.3,9.3-9.3s9.3,4.2,9.3,9.3v4H15.7V15.7z M37,19.7v-4c0-6.6-5.4-12-12-12
                            c-6.6,0-12,5.4-12,12v4c-2.9,0-5.3,2.4-5.3,5.3l0,16v5.3H13h24h5.3V41V25C42.3,22.1,39.9,19.7,37,19.7z"/>
                    </svg> 
                    <IconButton 
                        onClick={togglePasswordVisiblitySecond}
                        className={passwordShownSecond ? "passvisible" : "passnovisible"}
                        >{passwordShownSecond ? <Visible /> : <NoVisible  />}
                    </IconButton> 
                    {newPassword ?
                        <PasswordStrengthMeter
                            minPasswordEntropy={passwordMinEntropy()}
                            currentPasswordEntropy={props.currentPasswordEntropy}
                            passwordExist={newPassword !== ''}
                            passwordErrorFirstSolved={passwordErrorFirstSolved}
                            passwordErrorSecondSolved={passwordErrorSecondSolved}
                            passwordErrorThirdSolved={passwordErrorThirdSolved}
                            passwordErrorForthSolved={passwordErrorForthSolved}
                            passwordPopUp={passwordPopUp}
                            translate={translate}
                        /> : null}
                </div>
                <div className={confirmPasswordClass}>
                    <IconInput
                        type={passwordShownThird ? "text" : "password"}
                        placeholder={intl.formatMessage({id: 'page.body.profile.header.account.content.password.conf'})}
                        handleChangeInput={setConfirmationPassword}
                        inputValue={confirmationPassword}
                        handleFocusInput={() => setConfirmPasswordFocus(!confirmPasswordFocus)}
                        classNameInput="login-form__input"
                        autoFocus={false}
                        maxLength={30}
                    />
                    <svg className="iconfrom" version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 50 50">
                        <path d="M25,27.7c-0.7,0-1.3,0.6-1.3,1.3v8c0,0.7,0.6,1.3,1.3,1.3c0.7,0,1.3-0.6,1.3-1.3v-8
                            C26.3,28.3,25.7,27.7,25,27.7z M39.7,41c0,1.5-1.2,2.7-2.7,2.7l-24,0c-1.5,0-2.7-1.2-2.7-2.7V25c0-1.5,1.2-2.7,2.7-2.7l24,0
                            c1.5,0,2.7,1.2,2.7,2.7V41z M15.7,15.7c0-5.2,4.2-9.3,9.3-9.3s9.3,4.2,9.3,9.3v4H15.7V15.7z M37,19.7v-4c0-6.6-5.4-12-12-12
                            c-6.6,0-12,5.4-12,12v4c-2.9,0-5.3,2.4-5.3,5.3l0,16v5.3H13h24h5.3V41V25C42.3,22.1,39.9,19.7,37,19.7z"/>
                    </svg> 
                    <IconButton 
                        onClick={togglePasswordVisiblityThird}
                        className={passwordShownThird ? "passvisible" : "passnovisible"}
                        >{passwordShownThird ? <Visible /> : <NoVisible  />}
                    </IconButton> 
                </div>
                <div className="login-form__button">
                    <Button
                        className={props.hideOldPassword ? "big-button" : "medium-button"}
                        disabled={!isValidForm()}
                        onClick={handleChangePassword}
                    >
                        {intl.formatMessage({id: 'page.body.profile.header.account.content.password.button.change'})}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export const ChangePassword = React.memo(ChangePasswordComponent);
