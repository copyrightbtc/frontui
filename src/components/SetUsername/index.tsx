import cr from 'classnames';
import React from 'react';
import { Button, IconButton } from '@mui/material';
import { CloseIcon } from '../../assets/images/CloseIcon';
import { useIntl } from 'react-intl';
import { FormControl, InputGroup } from 'react-bootstrap';

export const SetUsernameComponent = props => {
    const { formatMessage } = useIntl();

    const [username, setUsename] = React.useState("");
    const [usernameFocus, setUsernameFocus] = React.useState(false);

    const intl = useIntl();

    const handleSetUsername = () => {
        props.handleSetUsername({username});
        setUsernameFocus(false);
    };
 
    const handleFocusUsername = () => {
        setUsernameFocus(!usernameFocus);
    };

    const isValidForm = (username: string) => {
        if (username.length < 3) return false

        return true;
    };

    const renderHeader = () => (
        <div className="modal-window__container__header"> 
            <h1>{props.title}</h1>
            <div className="modal-window__container__header__close">
                <IconButton 
                    onClick={props.closeModal}
                    sx={{
                        color: 'var(--color-dark)',
                        '&:hover': {
                            color: 'var(--color-accent)'
                        }
                    }}
                >
                    <CloseIcon className="icon_closeed themes"/>
                </IconButton>
            </div>
        </div>
    );
    
    const renderBody = () => {
        
        const handleEnterPress = React.useCallback(
            (event: React.KeyboardEvent<HTMLDivElement>) => {
                if (event.key === 'Enter') {
                    event.preventDefault();
    
                    handleSetUsername();
                }
            },
            [handleSetUsername]
        );
    
        const usernameClass = cr('login-form__content__group', {
            'login-form__content__group--focused': usernameFocus,
        });

        const maxLength = 20; 

        const handleInputChange = (e) => {
            setUsename(e.target.value.replace(/[^\w\s\-\_]/g, ""));
        };
 
        return (
            <div className={usernameClass} onKeyPress={handleEnterPress}>
                <div className="l-padding with-counter">
                    <label className="relate">{formatMessage({id:'page.body.profile.username.label'})}</label>
                    <InputGroup>
                        <div className="input-counter">{username.length} / {maxLength}</div>
                        <FormControl
                            bsPrefix="inputs-custom"
                            type="text"
                            placeholder={formatMessage({id:'page.body.profile.username.placeholder'})}
                            value={username}
                            onChange={handleInputChange}
                            onFocus={handleFocusUsername}
                            onBlur={handleFocusUsername}
                            className="form-control-bord themes"
                            autoFocus={false}
                            maxLength={maxLength}
                        />
                    </InputGroup>
                </div>

            </div>
        );
    };

    const renderFooter = () => {
        return (
            <div className="modal-window__buttons">
                <Button
                    onClick={props.closeModal} 
                    className="medium-button themes black"
                >
                    {intl.formatMessage({id: 'page.body.p2p.create.offer.cancel'})}
                </Button>
                <Button
                    disabled={!isValidForm(username)}
                    onClick={() => {
                        handleSetUsername();
                        props.closeModal();
                    }} 
                    className="medium-button themes"
                >
                    {intl.formatMessage({id: 'page.body.p2p.create.offer.confirm'})}
                </Button>
            </div>
        );
    };

    return (
        <form className="modal-window__container fadet"> 
            <div className="login-form"> 
                <div className="login-form__content">
                    {props.title && renderHeader()}
                    <div className="modal-window__title">
                        {intl.formatMessage({id: 'page.body.profile.username.description'})}
                    </div>
                    {renderBody()}
                    <div className="modal-window__description-bottom">
                        {intl.formatMessage({id: 'page.body.profile.username.description.bottom'})}
                    </div>
                    {renderFooter()}
                </div>
            </div>
        </form>
    );
};

export const SetUsername = React.memo(SetUsernameComponent);
