import * as React from 'react';
import { IconButton, Button } from '@mui/material';
import OtpInput from "react-otp-input";
import { CSSTransition } from "react-transition-group";
import {
    injectIntl,
} from 'react-intl';
import { IntlProps } from '../../';
import { Decimal } from '../../components';
import { CloseIcon } from '../../assets/images/CloseIcon';
import { ModalMobile } from '../../mobile/components/ModalMobile';
import { Beneficiary } from 'src/modules';

interface ModalWithdrawConfirmationProps {
    beneficiary: Beneficiary;
    amount: string;
    total: string;
    fee: string;
    otpCode: string;
    type: "fiat" | "coin";
    currency: string;
    rid: string;
    protocol?: string;
    isMobileDevice?: boolean;
    show: boolean;
    precision: number;
    onSubmit: () => void;
    onDismiss: () => void;
    handleChangeCodeValue: (value: string) => void;
}

type Props = ModalWithdrawConfirmationProps & IntlProps;

class ModalWithdraw extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    public componentWillUnmount() {
        document.getElementById('root')?.style.setProperty('height', 'auto');
    }

    public componentDidUpdate(prevProps: Props) {
        if (prevProps.show !== this.props.show) {
            if (!prevProps.show && this.props.show) {
                document.getElementById('root')?.style.setProperty('height', '100%');
            }
    
            if (prevProps.show && !this.props.show) {
                document.getElementById('root')?.style.setProperty('height', 'auto');
            }
        }
    }

    public translate = (e: string) => {
        return this.props.intl.formatMessage({id: e});
    };
    public render() {
        const { show, isMobileDevice } = this.props;

        return isMobileDevice ?
            <ModalMobile title={this.renderHeader()} onClose={this.props.onDismiss} isOpen={this.props.show}>
                <div>
                    {this.renderBody()}
                </div>
                <div>
                    {this.renderFooter()}
                </div>
            </ModalMobile> : (
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
                        <div className="modal-body__withdraw-confirm">
                            {this.renderHeader()}
                            {this.renderBody()}
                            {this.renderFooter()}
                        </div>
                    </div>
                </div>
            </CSSTransition>
        );
    }

    private renderHeader = () => {
        const formattedCurrency = this.props.currency.toUpperCase();
        return (
            <div className="modal-window__container__header">
                <h1>
                    {this.translate('page.body.wallets.tabs.withdraw.modal.title')}
                    {` ${formattedCurrency}`}
                </h1>
                <div className="modal-window__container__header__close">
                    <IconButton 
                        onClick={this.props.onDismiss}
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
        );
    };

    private renderBody = () => {
        const { amount, currency, precision, rid, total, fee, beneficiary, protocol } = this.props;
        const formattedCurrency = currency.toUpperCase();
        return (
            <div className="modal-body__withdraw-confirm__body">
                <div className="modal-body__withdraw-confirm__columns">
                    <div className="name">
                        {this.translate('page.body.wallets.tabs.withdraw.modal.withdrawTo')}
                    </div>
                    <div className="details">
                        {rid}
                    </div>
                </div>
                <div className="modal-body__withdraw-confirm__columns">
                    <div className="name">
                        {this.translate('page.body.wallets.tabs.withdraw.modal.name')}
                    </div>
                    <div className="details">
                        {beneficiary.name}
                    </div>
                </div>
                {beneficiary.protocol || protocol ?
                    <div className="modal-body__withdraw-confirm__columns">
                        <div className="name">
                            {this.translate('page.body.wallets.withdraw.blockchain.network')}
                        </div>
                        <div className="details">
                            {beneficiary.protocol?.toUpperCase() || protocol?.toUpperCase()}
                        </div>
                    </div>
                : null}
                <div className="modal-body__withdraw-confirm__columns">
                    <div className="name">
                        {this.translate('page.body.wallets.tabs.withdraw.modal.amount')}
                    </div>
                    <div className="details">{Decimal.format(amount, precision, ',')} {formattedCurrency}</div>
                </div>
                <div className="modal-body__withdraw-confirm__columns">
                    <div className="name">
                        {this.translate('page.body.wallets.tabs.withdraw.modal.fee')}
                    </div>
                    <div className="details">{Decimal.format(fee, precision, ',')} {formattedCurrency}</div>
                </div>
                <div className="modal-body__withdraw-confirm__block">
                    <div className="name">
                        {this.translate('page.body.wallets.tabs.withdraw.modal.total')}
                    </div>
                    <div className="details">
                        {Decimal.format(total, precision, ',')} {formattedCurrency}
                    </div>
                </div>
            </div>
        );
    };

    private handleEnterClick = e => {
        if (e.key === 'Enter' && this.props.otpCode.length >= 6) {
            e.preventDefault();
            this.props.onSubmit();
        }
    };

    private renderFooter = () => {
        const { otpCode } = this.props;

        return (
            <React.Fragment>
                <div className="twofa__form__content">
                    <div className="twofa__form__content__header">
                        {this.translate('page.mobile.twoFactorModal.subtitle')}
                    </div>
                    <div className="twofa__form__content__body" onSubmit={e => this.handleEnterClick(e)}>
                        <OtpInput
                            inputType="number"
                            value={otpCode}
                            onChange={e => this.props.handleChangeCodeValue(e)}
                            numInputs={6}
                            renderSeparator={<span>-</span>}
                            shouldAutoFocus={true}
                            skipDefaultStyles={true}
                            inputStyle={{
                                caretColor: "var(--accent)"
                            }}
                            renderInput={(props) => <input {...props} />}
                        />
                    </div>
                </div>
                <div className="modal-window__container__footer"> 
                <Button
                    disabled={otpCode.length < 6}
                    onClick={this.props.onSubmit}
                    className="medium-button"
                >
                    {this.translate('page.body.wallets.tabs.withdraw.modal.title.button')}
                </Button>
            </div>
        </React.Fragment>
        );
    };
}

// tslint:disable-next-line
export const ModalWithdrawConfirmation = injectIntl(ModalWithdraw) as any;
