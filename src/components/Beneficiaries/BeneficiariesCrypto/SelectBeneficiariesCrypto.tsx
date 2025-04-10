import classnames from 'classnames';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { Button } from '@mui/material';
import {
    selectCurrencies,
    selectBeneficiaries,
    Beneficiary,
    Currency,
    BlockchainCurrencies,
} from '../../../modules';
import { OverlayTrigger } from 'react-bootstrap';
import { Tooltip } from '../../../components';
import { InfoIcon } from 'src/assets/images/InfoIcon';
import { DEFAULT_FIAT_PRECISION } from '../../../constants';
import { Decimal } from '../../../components';
import {
    getAddressWithoutTag,
    //getTag,
    requiresMemoTag,
    requiresDTTag,
} from '../../../helpers/tagBasedAsset';
import { truncateMiddle } from '../../../helpers';
import { SucceedIcon } from 'src/containers/Wallets/SucceedIcon';
import { PendingIcon } from 'src/containers/Wallets/PendingIcon';

interface SelectBeneficiariesCryptoProps {
    blockchainKey: string;
    currency: string;
    handleClickSelectAddress: (item: Beneficiary) => () => void;
    handleDeleteAddress: (item: Beneficiary) => () => void;
}

export const SelectBeneficiariesCrypto: React.FunctionComponent<SelectBeneficiariesCryptoProps> = (props: SelectBeneficiariesCryptoProps) => {
    const { currency, blockchainKey } = props;

    const { formatMessage } = useIntl();

    const currencies = useSelector(selectCurrencies);
    const beneficiaries: Beneficiary[] = useSelector(selectBeneficiaries);
    //const currentBeneficiary = React.useMemo(() => beneficiaries.find(item => item.blockchain_key === blockchainItem?.blockchain_key), [beneficiaries]);

    const currencyItem: Currency = currencies.find(item => item.id === currency);

    const blockchainItem: BlockchainCurrencies = currencyItem?.networks.find(item => item.blockchain_key === blockchainKey);
    const estimatedFeeValue = +currencyItem?.price * +blockchainItem?.withdraw_fee;

    const renderDropdownTipCryptoNote = React.useCallback((note: string) => {
        return (
            <div className="tip__content__block">
                <span className="tip__content__block__label">{formatMessage({ id: 'page.body.wallets.beneficiaries.tipDescription' })}</span>
                <span className="tip__content__block__value">{note}</span>
            </div>
        );
    }, []);

    const renderDropdownTipCrypto = React.useCallback((currency, address, beneficiaryName, description, memo) => {
            let textTagID = '';
            if (requiresMemoTag(currency)) {
                textTagID = 'page.body.wallets.beneficiaries.memo';
            }

            if (requiresDTTag(currency)) {
                textTagID = 'page.body.wallets.beneficiaries.destinational.tag';
            }

            return (
                <div className="withdraw-added-item__dropdown__tip tip">
                    <div className="tip__content">
                        <div className="tip__content__block">
                            <span className="tip__content__block__label">{formatMessage({ id: 'page.body.wallets.beneficiaries.tipAddress' })}</span>
                            <span className="tip__content__block__value">{address}</span>
                        </div>
                        {textTagID && <div className="tip__content__block">
                            <span className="tip__content__block__label">
                                {formatMessage({ id: textTagID })}
                            </span>
                            <span className="tip__content__block__value">{memo}</span>
                        </div>}
                        <div className="tip__content__block">
                            <span className="tip__content__block__label">{formatMessage({ id: 'page.body.wallets.beneficiaries.tipName' })}</span>
                            <span className="tip__content__block__value">{beneficiaryName}</span>
                        </div>
                        {description && renderDropdownTipCryptoNote(description)}
                    </div>
                </div>
            );
    }, []);

    const renderDropdownTipFiat = React.useCallback((data) => {
            return (
                <div className="withdraw-added-item__dropdown__tip tip">
                    <div className="tip__content">
                        <div className="tip__content__block">
                            <span className="tip__content__block__label">{formatMessage({ id: 'page.body.wallets.beneficiaries.addAddressModal.body.fiatFullName' })}</span>
                            <span className="tip__content__block__value">{data?.full_name}</span>
                        </div>
                        <div className="tip__content__block">
                            <span className="tip__content__block__label">{formatMessage({ id: 'page.body.wallets.beneficiaries.addAddressModal.body.fiatAccountNumber' })}</span>
                            <span className="tip__content__block__value">{data?.account_number}</span>
                        </div>
                        <div className="tip__content__block">
                            <span className="tip__content__block__label">{formatMessage({ id: 'page.body.wallets.beneficiaries.addAddressModal.body.fiatBankName' })}</span>
                            <span className="tip__content__block__value">{data?.bank_name}</span>
                        </div>
                    </div>
                </div>
            );
    }, []);

    const renderBeneficiaryItem = React.useCallback((item, index) => {
        const isPending = item.state && item.state.toLowerCase() === 'pending';
        const isDescription = item.description === null;
        const itemClassName = classnames('withdraw-added-item__wrapper__down__button', {
            'pending': isPending,
            'disabled': !blockchainItem?.withdrawal_enabled,
        });
        const address = getAddressWithoutTag(item.data?.address);
        //const memo = getTag(item.data?.address);

        if (item.blockchain_key === blockchainKey) {
            return (
                <div key={index} className="withdraw-added-item__wrapper__down__select">
                    <div className={itemClassName} onClick={blockchainItem?.withdrawal_enabled && props.handleClickSelectAddress(item)}>
                        <span className="title">
                            {item.name}
                            {!isDescription ? 
                                <OverlayTrigger 
                                    placement="auto"
                                    delay={{ show: 250, hide: 300 }} 
                                    overlay={<Tooltip title={item.description} />}>
                                        <div className="tip_icon_container">
                                            <InfoIcon />
                                        </div>
                                </OverlayTrigger> : null }
                        </span>
                        <span className="address">
                            {truncateMiddle(address, 45)}
                        </span>
                    </div>
                    <div className="withdraw-added-item__wrapper__down__block">
                        {isPending ? (
                            <div className="state pending">
                                {formatMessage({ id:'page.body.wallets.beneficiaries.dropdown.pending' })}<PendingIcon />
                            </div>
                        ) : <div className="state active">
                                {formatMessage({ id:'page.body.wallets.beneficiaries.dropdown.active' })}<SucceedIcon />
                            </div>}
                        <div className="delete">
                            <Button
                                onClick={props.handleDeleteAddress(item)}
                                className="little-button red"
                            >
                                {formatMessage({ id: 'page.body.wallets.beneficiaries.deletebutton' })}
                            </Button>
                        </div>
                    </div>
                </div>
            );
        };

        return null;
    }, [beneficiaries]);

    const classTitle = classnames('withdraw-added-item__wrapper__up', {
        'withdraw-added-item__wrapper__up__disabled': !blockchainItem?.withdrawal_enabled,
    });
 
    return (
        <React.Fragment>
            {blockchainItem?.status !== 'disabled' && 
            <div className="withdraw-added-item__wrapper" key={blockchainKey}>
                <div className={classTitle}> 
                {blockchainItem?.status === 'disabled'}
                    <div className="withdraw-added-item__wrapper__up__block">
                        <h3 className="protocol">
                            {blockchainItem?.protocol || blockchainItem?.blockchain_key ?
                                `${blockchainItem?.protocol?.toUpperCase() || blockchainItem?.blockchain_key?.toUpperCase()}`
                                : formatMessage({ id: 'page.body.wallets.beneficiaries.addresses' })}
                            {!blockchainItem?.withdrawal_enabled && <span className="disabled">{formatMessage({ id: "page.body.wallets.beneficiaries.withdrawal.disabled" })}</span>}
                        </h3>
                        <div className="name">{currencyItem?.name} ({currencyItem?.id.toUpperCase()})</div>
                        <div className="fee">
                            <span>{formatMessage({ id: 'page.body.wallets.beneficiaries.network.fee' })}</span>
                            <Decimal fixed={currencyItem?.precision} thousSep=",">{blockchainItem?.withdraw_fee?.toString()}</Decimal>
                            &nbsp;{currencyItem?.id.toUpperCase()}
                        </div>
                    </div>
                    <div className="withdraw-added-item__wrapper__up__block">
                        <div className="bold"><span>{formatMessage({ id: "page.body.wallets.beneficiaries.min.withdraw" })} </span>{blockchainItem?.min_withdraw_amount}&nbsp;{currencyItem?.id.toUpperCase()}</div>
                        <div className="secondary">≈ $<Decimal fixed={DEFAULT_FIAT_PRECISION} thousSep=",">{estimatedFeeValue.toString()}</Decimal></div>
                    </div>
                </div>
                <div className="withdraw-added-item__wrapper__down">
                    {beneficiaries.map(renderBeneficiaryItem)}
                </div>
            </div>}
        </React.Fragment>
    );
}
