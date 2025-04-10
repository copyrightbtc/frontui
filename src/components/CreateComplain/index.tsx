import React from 'react';
import { Button, IconButton } from '@mui/material';
import { CloseIcon } from '../../assets/images/CloseIcon';
import { useIntl } from 'react-intl';
import TextArea from "../../components/SelectP2PFilter/TextArea";

export const CreateComplainComponent = props => {
    const { formatMessage } = useIntl();

    const [message, setMessage] = React.useState('');

    const intl = useIntl();
    const maxLength = 500; 
    const handleCreateComplain = () => {
        props.handleCreateComplain({
            message,
        });

        setMessage('')
    };

    const handleEnterPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();

            if (isValidForm()) {
                handleCreateComplain();
            }
        }
    };

    const isValidForm = () => {
        if (!message.length) return false;
        return true;
    }; 
 
    const renderHeader = () => (
        <div className="modal-window__container__header">
            <h1>{props.title}</h1>
            <div className="modal-window__container__header__close">
                <IconButton 
                    onClick={props.closeModal}
                    sx={{
                        color: '#fff',
                        '&:hover': {
                            color: 'var(--color-accent)'
                        }
                    }}
                >
                    <CloseIcon className="icon_closeed"/>
                </IconButton>
            </div>             
        </div>
    );

    const renderBody = () => {
        return (
            <div className="modal-window__complain with-area" onKeyPress={handleEnterPress}>
                <div className="modal-window__complain__title">
                    {formatMessage({id: "page.body.p2p.trade.modal.complain.message.note"})}
                </div>
                <TextArea
                    rows={4}
                    maxLength={maxLength}
                    value={message}
                    placeholder={formatMessage({
                        id: "page.body.p2p.trade.modal.complain.message"
                    })}
                    onChange={setMessage}
                    suffix={<div className="input-counter">{message.length} / {maxLength}</div>}
                />
            </div>
        );
    };

    const renderFooter = () => {
        return (
            <div className="modal-window__button">
                <Button
                    className='medium-button themes'
                    disabled={!isValidForm() || message.length > maxLength}
                    onClick={handleCreateComplain}
                >
                    {intl.formatMessage({id: 'page.body.p2p.trade.modal.complain.create'})}
                </Button>
            </div>
        );
    };

    return (
        <div className="login-form"> 
            <div className="login-form__content">
                {renderHeader()}
                {renderBody()}
                {renderFooter()}
            </div> 
        </div>
    );
};

export const CreateComplain = React.memo(CreateComplainComponent);
