import * as React from 'react';
import { Button } from '@mui/material';
import OtpInput from "react-otp-input";
import {
    injectIntl,
} from 'react-intl';
import { IntlProps } from 'src';
import { Decimal } from 'src/components';
import { CloseIcon } from 'src/assets/images/CloseIcon';
import { ModalMobile } from 'src/mobile/components/ModalMobile';
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
        const { show, onDismiss } = this.props;

        return (
            <ModalMobile
                onClose={onDismiss} 
                isOpen={show}
            >
                <div className="mobile-modal__header">
                    <div className="mobile-modal__header-title">{this.translate('page.body.wallets.tabs.withdraw.modal.title')}</div>
                    <div className="mobile-modal__header-close" onClick={onDismiss}>
                        <CloseIcon />
                    </div>
                </div>
                <div className="mobile-wallet modal-body__withdraw-confirm">
                    {this.renderBody()}
                    {this.renderFooter()}
                </div> 
            </ModalMobile>
        )
    }

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
                    className="medium-button themes"
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
