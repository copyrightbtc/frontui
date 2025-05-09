import * as React from 'react';
import { Button, IconButton } from '@mui/material';
import { CloseIcon } from '../../assets/images/CloseIcon';
import { selectMobileDeviceState } from '../../modules';
import { useReduxSelector } from '../../hooks';
import { ModalMobile } from 'src/mobile/components';

export interface ExpiredSessionModalProps {
    title: string;
    buttonLabel: string;
    handleSubmitExpSessionModal: () => void;
    handleChangeExpSessionModalState: () => void;
}

export const ExpiredSessionModal = (props: ExpiredSessionModalProps) => {

    const { title, buttonLabel, handleChangeExpSessionModalState, handleSubmitExpSessionModal } = props;
    const isMobileDevice = useReduxSelector(selectMobileDeviceState);

    return (
        <React.Fragment>
            {isMobileDevice ? 
            <ModalMobile
                isOpen={handleChangeExpSessionModalState}
            >
                <div className="mobile-modal__header">
                    <div className="mobile-modal__header-title">
                         
                    </div>
                    <div className="mobile-modal__header-close" onClick={handleChangeExpSessionModalState}>
                        <CloseIcon />
                    </div>
                </div>
                <div className="mobile-modal__expired-session">
                    <h5>{title}</h5>
                    <div className="mobile-modal__button">
                        <Button
                            className="medium-button themes"
                            onClick={handleSubmitExpSessionModal}
                        >
                            {buttonLabel}
                        </Button>
                    </div>
                </div>
            </ModalMobile> : 
            <div className="modal-window">
                <div className="modal-window__container">
                    <div className="modal-window__container__content"> 
                        <div className="modal-window__container__header"> 
                            <h1>{title}</h1>
                            <div className="modal-window__container__header__close">
                            <IconButton 
                                onClick={handleChangeExpSessionModalState}
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
                        <div className="modal-window__container__footer"> 
                            <Button
                                className="big-button"
                                onClick={handleSubmitExpSessionModal}
                            >
                                {buttonLabel}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>}
        </React.Fragment>
    );
}
