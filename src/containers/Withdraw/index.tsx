import * as React from 'react';
import { Button } from '@mui/material';
import Accordion from 'react-bootstrap/Accordion';
import { connect, MapStateToProps } from 'react-redux';
import { injectIntl } from 'react-intl';
import { compose } from 'redux';
import { IntlProps } from 'src';
import { CryptoIcon } from 'src/components/CryptoIcon';
import { ArrowDownward } from 'src/assets/images/ArrowDownward';
import { WarningIcon } from 'src/assets/images/WarningIcon';
import {
    Beneficiaries,
    InputWithButton,
} from "../../components";
import { Decimal } from '../../components/Decimal';
import { cleanPositiveFloatInput, precisionRegExp } from '../../helpers';
import { Beneficiary, BlockchainCurrencies, RootState, selectBeneficiaries } from '../../modules';
import { UserWithdrawalLimits } from './UserWithdrawalLimits';
import { DEFAULT_FIAT_PRECISION } from '../../constants';

export interface WithdrawProps {
    currency: string;
    fee: number;
    balance: string;
    onClick: (amount: string, total: string, beneficiary: Beneficiary, otpCode: string, fee: string) => void;
    fixed: number;
    className?: string;
    type: 'fiat' | 'coin';
    price: string;
    name: string;
    twoFactorAuthRequired?: boolean;
    withdrawAmountLabel?: string;
    withdraw2faLabel?: string;
    withdrawSumlLabel?: string;
    withdrawFeeLabel?: string;
    withdrawTotalLabel?: string;
    withdrawButtonLabel?: string;
    withdrawDone: boolean;
    networks: BlockchainCurrencies[];
    isMobileDevice?: boolean;
    withdrawAllButtonLabel?: string;
}
export interface OwnWithdProps{
    beneficiaries: Beneficiary[];
}
const defaultBeneficiary: Beneficiary = {
    id: 0,
    currency: '',
    name: '',
    blockchain_key: '',
    blockchain_name: '',
    state: '',
    data: {
        address: '',
    },
};

interface WithdrawState {
    amount: string;
    beneficiary: Beneficiary;
    otpCode: string;
    withdrawCodeFocused: boolean;
    total: string;
}

type Props = WithdrawProps & IntlProps & OwnWithdProps;

class WithdrawComponent extends React.Component<Props, WithdrawState> {
    public state = {
        amount: '',
        beneficiary: defaultBeneficiary,
        otpCode: '',
        withdrawCodeFocused: false,
        total: '',
    };

    public componentWillReceiveProps(nextProps) {
        const { currency, withdrawDone } = this.props;

        if ((nextProps && (nextProps.currency !== currency)) || (nextProps.withdrawDone && !withdrawDone)) {
            this.clearFields(this.state.beneficiary);
        }
    }

    public translate = (id: string) => this.props.intl.formatMessage({ id });

    public render() {
        const {
            amount,
            beneficiary,
            total,
            otpCode,
        } = this.state;
        const {
            networks,
            currency,
            type,
            withdrawAmountLabel,
            withdrawSumlLabel,
            withdrawFeeLabel,
            withdrawTotalLabel,
            withdrawButtonLabel,
            withdrawAllButtonLabel,
            fixed,
            price,
            name,
            beneficiaries,
            balance
        } = this.props;

        const blockchainItem = networks?.find(item => item.blockchain_key === beneficiary.blockchain_key);

        const estimatedValueFee = +price * +blockchainItem?.withdraw_fee;

        const text1 = this.props.intl.formatMessage({ id: 'page.body.wallets.tabs.deposit.ccy.withdraw.instruction.2' },
            {name: this.props.name, asset: currency.toUpperCase()});

        const text2 = this.props.intl.formatMessage({ id: 'page.body.wallets.tabs.deposit.ccy.withdraw.instruction.3' },
            {amount: Decimal.format(blockchainItem?.min_withdraw_amount?.toString(), fixed) === '0' ? '-.--' : Decimal.format(blockchainItem?.min_withdraw_amount?.toString(), fixed), 
                asset: currency.toUpperCase()});

        return (
            <React.Fragment>
                <div className="wallets-coinpage__wrapper__body__left">
                    <div className="withdraw-container">
                        <Beneficiaries
                            currency={currency}
                            type={type}
                            onChangeValue={this.handleChangeBeneficiary}
                        />
                        {beneficiaries.length ?
                        <Accordion>
                            <Accordion.Item eventKey="1">
                                <Accordion.Header>
                                    <h5>{this.translate('page.body.wallets.beneficiaries.netdetails')}</h5>
                                    <ArrowDownward className="arrow" />
                                </Accordion.Header>
                                <Accordion.Body>
                                <div className="withdraw-container__row">
                                    <span>{ type === 'fiat' ? 
                                        this.translate('page.body.wallets.beneficiaries.currency') : this.translate('page.body.wallets.beneficiaries.coin')}
                                    </span>
                                    <div className="withdraw-container__row__details">
                                        {name} ({currency.toUpperCase()})
                                        <CryptoIcon className="coins-img" code={currency.toUpperCase()} />
                                    </div>
                                </div>
                                <div className="withdraw-container__row">
                                    <span>{this.translate('page.body.wallets.tabs.deposit.network')}</span>
                                    <div className="withdraw-container__row__details">
                                        {beneficiary?.protocol?.toUpperCase() || beneficiary?.blockchain_key?.toUpperCase()}
                                    </div>
                                </div>
                                <div className="withdraw-container__row column">
                                    <span>{this.translate('page.body.wallets.beneficiaries.withdrawalfee')}</span>
                                    <div className="withdraw-container__row__details">
                                        <div><Decimal fixed={fixed} thousSep=",">{blockchainItem?.withdraw_fee?.toString()}</Decimal>&nbsp;{currency.toUpperCase()}</div>
                                        <small>≈ $<Decimal fixed={DEFAULT_FIAT_PRECISION} thousSep=",">{estimatedValueFee.toString()}</Decimal></small>
                                    </div>
                                </div>
                                <div className="withdraw-container__row">
                                    <span>{this.translate('page.body.wallets.beneficiaries.minamountwithdraw')}</span>
                                    <div className="withdraw-container__row__details">
                                        <Decimal fixed={fixed} thousSep=",">{blockchainItem?.min_withdraw_amount?.toString()}</Decimal>&nbsp;{currency.toUpperCase()}
                                    </div>
                                </div>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                        : null }

                        <UserWithdrawalLimits
                            currencyId={currency}
                            fixed={fixed}
                            price={price}
                        />

                        <div className="withdraw-container__amount">
                            <h5>{this.translate('page.body.wallets.tabs.withdraw.content.amount.title')}</h5>
                            <div className="amount-field">
                                <InputWithButton
                                    type="number"
                                    value={amount}
                                    label={withdrawAmountLabel || this.translate('page.body.wallets.tabs.withdraw.content.amount')}
                                    handleChangeInput={this.handleChangeInputAmount}
                                    className="amount-field__class"
                                    buttonText={withdrawAllButtonLabel}
                                    handleClickButton={this.handleClickAllAmount}
                                />
                            </div>
                        </div>
                        <div className="withdraw-container__amount__column">
                        {Number(amount) > Number(balance) ? (
                            <div className="withdraw-container__amount__column__error">
                                <span>{this.translate('page.body.wallets.tabs.withdraw.content.amount.exceded')}</span>
                            </div>
                            ) : (
                            <React.Fragment>
                                <div className="cols"> 
                                    <div className="name">{withdrawSumlLabel ? withdrawSumlLabel : 'Amount'}</div>
                                    <div className="summary">{this.renderSum()}</div>
                                </div>
                                <div className="cols">
                                    <div className="name">{withdrawFeeLabel ? withdrawFeeLabel : 'Fee'}</div>
                                    <div className="summary">{this.renderFee()}</div>
                                </div>
                                <div className="cols"> 
                                    <div className="name">{withdrawTotalLabel ? withdrawTotalLabel : 'You\'ll get'}</div>
                                    <div className="summary">{this.renderTotal()}</div>
                                </div>
                            </React.Fragment>)}
                        </div>
                        <div className="withdraw-container__amount__button">
                            {blockchainItem && !blockchainItem.withdrawal_enabled ? 
                            <div className='withdraw-container__amount__disabled'> 
                                <WarningIcon />
                                {this.props.intl.formatMessage({ id: 'page.body.wallets.warning.withdraw.no.disabled'}, {currency: currency.toUpperCase()})}
                            </div>
                            :
                            <Button
                                onClick={this.handleClick}
                                disabled={this.handleCheckButtonDisabled(total, beneficiary, otpCode) || blockchainItem && !blockchainItem.withdrawal_enabled}
                                className="medium-button"
                            >
                                {withdrawButtonLabel ? withdrawButtonLabel : this.translate('page.body.wallets.tabs.withdraw.content.button')}
                            </Button>
                            }
                        </div>
                    </div>
                </div>
                <div className="wallets-coinpage__wrapper__body__right">
                    <h4>{this.translate('page.body.wallets.tabs.deposit.ccy.withdraw.instruction.title')}</h4>
                    <ul>
                        <li>{this.translate('page.body.wallets.tabs.deposit.ccy.withdraw.instruction.1')}</li>
                        <li>{text1}</li>
                        <li>{text2}</li>
                        <li>{this.translate('page.body.wallets.tabs.deposit.ccy.withdraw.instruction.4')}</li>
                        <li>{this.translate('page.body.wallets.tabs.deposit.ccy.withdraw.instruction.5')}</li>
                    </ul>
                </div> 
            </React.Fragment>
        );
    }

    private clearFields = (beneficiary?: Beneficiary) => {
        this.setState({
            amount: '',
            otpCode: '',
            total: '',
            beneficiary: beneficiary || defaultBeneficiary,
        });
    };

    private handleCheckButtonDisabled = (total: string, beneficiary: Beneficiary, otpCode: string) => {
        const isPending = beneficiary.state && beneficiary.state.toLowerCase() === 'pending';

        return Number(total) <= 0 || Number(total) > Number(this.props.balance) || !Boolean(beneficiary.id) || isPending;
    };

    private renderFee = () => {
        const { networks, fixed, currency } = this.props;
        const { beneficiary } = this.state;

        const blockchainItem = networks?.find(item => item.blockchain_key === beneficiary.blockchain_key);

        return (
            <React.Fragment>
                {Decimal.format(blockchainItem?.withdraw_fee?.toString(), fixed)} {currency.toUpperCase()}
            </React.Fragment>
        );
    };

    private renderTotal = () => {
        const total = this.state.total;
        const { currency } = this.props;

        return total ? (
            <React.Fragment>
                {Number(total.toString())} {currency.toUpperCase()}
            </React.Fragment>
        ) : <React.Fragment>0 {currency.toUpperCase()}</React.Fragment>;
    };

    private renderSum = () => {
        const summ = this.state.amount;
        const { currency } = this.props;

        return summ ? (
            <React.Fragment>
                {Number(summ.toString())} {currency.toUpperCase()}
            </React.Fragment>
        ) : <React.Fragment>0 {currency.toUpperCase()}</React.Fragment>;
    };

    private handleClick = () => {
        const { networks } = this.props;
        const { beneficiary } = this.state;

        const blockchainItem = networks.find(item => item.blockchain_key === beneficiary.blockchain_key);

        this.props.onClick(
            this.state.amount,
            this.state.total,
            this.state.beneficiary,
            this.state.otpCode,
            blockchainItem.withdraw_fee?.toString(),
        );

        this.clearFields(beneficiary);
    }

    private handleChangeInputAmount = (value: string) => {
        const { beneficiary } = this.state;
        const { fixed, networks } = this.props;
        const convertedValue = cleanPositiveFloatInput(String(value));
        const blockchainItem = networks.find(item => item.blockchain_key === beneficiary.blockchain_key);

        if (convertedValue.match(precisionRegExp(fixed))) {
            const amount = (convertedValue !== '') ? Number(parseFloat(convertedValue).toFixed(fixed)) : '';
            const total = (amount !== '') ? (amount - +blockchainItem.withdraw_fee).toFixed(fixed) : '';

            if (Number(total) <= 0) {
                this.setTotal((0).toFixed(fixed));
            } else {
                this.setTotal(total);
            }

            this.setState({
                amount: convertedValue,
            });
        }
    };

    private handleClickAllAmount = () => {
        this.setState({ amount: Decimal.format(this.props.balance, this.props.fixed)});
        this.handleChangeInputAmount(this.props.balance);
    }

    private setTotal = (value: string) => {
        this.setState({ total: value });
    };

    private handleChangeBeneficiary = (value: Beneficiary) => {
        this.setState({
            beneficiary: value,
        });
    };
}

const mapStateToProps: MapStateToProps<OwnWithdProps, {}, RootState> = state => ({
    beneficiaries: selectBeneficiaries(state),
});

export const Withdraw = compose(
    injectIntl,
    connect(mapStateToProps),
)(WithdrawComponent) as any;
