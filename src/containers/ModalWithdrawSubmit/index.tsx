import * as React from 'react';
import {
    FormattedMessage,
    injectIntl,
} from 'react-intl';
import { IntlProps } from '../../';
import { CSSTransition } from "react-transition-group";
import { IconButton } from '@mui/material';
import { CloseIcon } from '../../assets/images/CloseIcon';
import { Modal as MobileModal } from '../../mobile/components/Modal';

interface ModalWithdrawSubmitProps {
    currency: string;
    onSubmit: () => void;
    show: boolean;
    isMobileDevice?: boolean;
}

type Props = ModalWithdrawSubmitProps & IntlProps;

class ModalWithdrawSubmitComponent extends React.Component<Props> {
    public translate = (e: string) => {
        return this.props.intl.formatMessage({id: e});
    };

    public render() {
        const { show, isMobileDevice } = this.props;

        return isMobileDevice ?
            <MobileModal isOpen={this.props.show}>
              <div>
                  {this.renderHeaderModalSubmit()}
              </div>
            </MobileModal> : (
            <CSSTransition
                in={show}
                timeout={{
                    enter: 100,
                    exit: 400
                }}
                unmountOnExit
            >
            <div className="modal-window"> 
                <div className="modal-window__container fadet wide">
                    <div className="modal-body__withdraw-success">
                        <div className="modal-window__container__header">
                            <h1>
                                {this.translate('page.modal.withdraw.success')}
                            </h1>
                            <div className="modal-window__container__header__close">
                                <IconButton 
                                    onClick={this.props.onSubmit}
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
                        <div className="modal-body__withdraw-success__body">
                            <span>{this.translate('page.modal.withdraw.success.message.content.h3')}</span>
                            <span>{this.translate('page.modal.withdraw.success.message.content.1')}</span>
                            <span>{this.translate('page.modal.withdraw.success.message.content.2')}</span>
                            <span>{this.translate('page.body.wallets.tabs.deposit.ccy.withdraw.instruction.5')}</span>
                        </div>
                    </div>
                </div>
            </div>
        </CSSTransition>
        );
    }

    private renderHeaderModalSubmit = () => {
        return (
            <div className="modal-body__withdraw-success__mobile">
                <FormattedMessage id="page.modal.withdraw.success" />
            </div>
        );
    };

}

export const ModalWithdrawSubmit = injectIntl(ModalWithdrawSubmitComponent);
