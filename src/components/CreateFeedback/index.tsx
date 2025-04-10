import React from 'react';
import { Button, IconButton } from '@mui/material';
import { CloseIcon } from '../../assets/images/CloseIcon';
import { useIntl } from 'react-intl';
import { LikeIcon } from "../../assets/images/LikeIcon";
import TextArea from "../../components/SelectP2PFilter/TextArea";
import { OverlayTrigger } from 'react-bootstrap';
import { Tooltip } from '../../components';

export const CreateFeedBackComponent = props => {
    const { formatMessage } = useIntl();
    const maxLength = 500; 

    const [rate, setRate] = React.useState('');
    const [message, setMessage] = React.useState('');

    const intl = useIntl();

    const handleCreateFeedback = () => {
        props.handleCreateFeedback({
            rate,
            message,
        });

        setRate('')
        setMessage('')
    };

    const isValidForm = () => {
        if (!rate.length) return false;

        return true;
    };

    const handleEnterPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();

            if (isValidForm()) {
                handleCreateFeedback();
            }
        }
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

    const renderRateSelect = () => {
        return (
			<div className='counts'>
                <Button
                    onClick={() => setRate('positive')}
                    variant="outlined"
                    className={`likes positive${rate === 'positive' ? " active" : ""}`}
                >
                    <LikeIcon />
                    {intl.formatMessage({ id: "page.body.p2p.trade.modal.feedback.positive" })}
                </Button>
                <Button
                    onClick={() => setRate('negative')}
                    variant="outlined"
                    className={`likes negative${rate === 'negative' ? " active" : ""}`}
                >
                    <LikeIcon />
                    {intl.formatMessage({ id: "page.body.p2p.trade.modal.feedback.negative" })}
                </Button>
			</div>
		);
    }

    const renderBody = () => {

        return (
            <div className="modal-window__feedback__body with-area" onKeyPress={handleEnterPress}>
                <div className='modal-window__feedback__rate'>
                    <h5>{formatMessage({id: 'page.body.p2p.trade.modal.feedback.rate'})}</h5>
                    {renderRateSelect()}
                </div>
                <TextArea
                    rows={4}
                    maxLength={maxLength}
                    value={message}
                    placeholder={formatMessage({
                        id: "page.body.p2p.trade.modal.feedback.message"
                    })}
                    onChange={setMessage}
                    suffix={<div className="input-counter">{message.length} / {maxLength}</div>}
                />
            </div>
        );
    };

    const renderFooter = () => {
        return (
            <div className="modal-window__feedback__button">
                 
                    <OverlayTrigger
                        placement="auto"
                        delay={{ show: 250, hide: 300 }} 
                        overlay={<Tooltip className="themes" title="page.body.p2p.trade.modal.feedback.tags" />}>
                            <div>
                            <Button
                    className='medium-button themes'
                    disabled={!isValidForm()}
                    onClick={handleCreateFeedback}
                >{intl.formatMessage({id: 'page.body.p2p.trade.modal.feedback.create'})}</Button></div>
                    </OverlayTrigger> 
            </div>
        );
    };

    return (
        <div className="modal-window__feedback">
            {renderHeader()}
            {renderBody()}
            {renderFooter()}
        </div>
    );
};

export const CreateFeedBack = React.memo(CreateFeedBackComponent);
