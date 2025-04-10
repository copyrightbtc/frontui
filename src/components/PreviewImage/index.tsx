import React from 'react';
import { IconButton } from '@mui/material';
import { CloseIcon } from '../../assets/images/CloseIcon';

export const PreviewImageComponent = props => {
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
            <div className='modal-window__image-form__body'>
                <img alt="preview" src={props.url} draggable="false" />
            </div>
        );
    };

    return (
        <div className="modal-window__image-form">
            {renderHeader()}
            {renderBody()}
        </div>
    );
};

export const PreviewImage = React.memo(PreviewImageComponent);
