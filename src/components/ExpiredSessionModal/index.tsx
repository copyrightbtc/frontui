import * as React from 'react';
import { Button, IconButton } from '@mui/material';
import { CloseIcon } from '../../assets/images/CloseIcon';

export interface ExpiredSessionModalProps {
    title: string;
    buttonLabel: string;
    handleSubmitExpSessionModal: () => void;
    handleChangeExpSessionModalState: () => void;
}

export class ExpiredSessionModal extends React.Component<ExpiredSessionModalProps> {
    public render() {
        const { title, buttonLabel } = this.props;

        return (
            <div className="modal-window">
                <div className="modal-window__container">
                    <div className="modal-window__container__content"> 
                        <div className="modal-window__container__header"> 
                            <h1>{title}</h1>
                            <div className="modal-window__container__header__close">
                            <IconButton 
                                onClick={this.props.handleChangeExpSessionModalState}
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
                                onClick={this.props.handleSubmitExpSessionModal}
                            >
                                {buttonLabel}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
