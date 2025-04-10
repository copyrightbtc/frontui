import { useIntl } from "react-intl";
import { Link } from "react-router-dom";
import { MAX_LIMIT_CURRENCY } from "../../modules/constant";
import { Decimal } from "../../components";
import { Button } from '@mui/material';
import { P2PAdvertisement, P2PAdvertisementUpdateRequest, p2pUpdateAdvertisementFetch } from "../../modules/user/p2pAdvertisement";
import React from "react";
import { formatNumber } from "../../components/P2PTrading/Utils";
import Input from "../../components/SelectP2PFilter/Input"
import TextArea from "../../components/SelectP2PFilter/TextArea";
import SelectP2PFilter from "../../components/SelectP2PFilter";
import { useDispatch, useSelector } from "react-redux";
import { RootState, selectMobileDeviceState, selectCurrencies } from "../../modules";
import { DepositPlusIcon } from "src/assets/images/DepositPlusIcon";

interface Props {
    advertisement: P2PAdvertisement;
    onClose: () => void;
}

const UpdateP2PAdsModal = ({ onClose, advertisement }: Props) => {
    const [formData, setFormData] = React.useState<P2PAdvertisementUpdateRequest>({
        id: advertisement.id,
        min_amount: Number(advertisement.min_amount ?? "0"),
        max_amount: Number(advertisement.max_amount ?? "0"),
        description: advertisement.description ?? "",
        paytime: advertisement.paytime,
    })

    const [errors, setErrors] = React.useState<{ [key: string]: string }>({})
    const [isSubmitted, setIsSubmitted] = React.useState(false);

    const intl = useIntl();
    const dispatch = useDispatch();
    const isMobileDevice = useSelector((state: RootState) => selectMobileDeviceState(state));

    const currencies = useSelector(selectCurrencies);
    const coinCurrencies = currencies.filter((currency) => currency.type === "coin");
    const coinCurrency = coinCurrencies.find((currency) => currency.id === advertisement.coin_currency);

    const isDirtyForm =
        formData.min_amount !== Number(advertisement.min_amount ?? "0")
        || formData.max_amount !== Number(advertisement.max_amount ?? "0")
        || formData.description !== advertisement.description
        || formData.paytime !== advertisement.paytime


    const validate = (data) => {
        const _errors = {} as { [key: string]: string };

        if (!data.min_amount || data.min_amount <= 0) {
            _errors.min_amount = intl.formatMessage({ id: "page.body.p2p.advertisement.message.min_required" });
        }
        if (!data.max_amount || data.max_amount <= 0) {
            _errors.max_amount = intl.formatMessage({ id: "page.body.p2p.advertisement.message.max_required" });
        }
        if (data.min_amount >= data.max_amount) {
            _errors.min_amount = intl.formatMessage({ id: "page.body.p2p.advertisement.message.min_limit" });
        }
        if (Number(data.max_amount) > (Number(data.price) * Number(data.amount))) {
            _errors.max_amount = `${intl.formatMessage({
                id: "page.body.p2p.advertisement.message.max_limit",
            })}: ${formatNumber(Number(data.price * data.amount))} ${advertisement.fiat_currency.toUpperCase()}`;
        }
        if (data.paytime < 0 || data.paytime > 180) {
            _errors.paytime = intl.formatMessage({ id: "page.body.p2p.advertisement.message.invalid_paytime" });
        }
        if (data.description && data.description.length > 255) {
            _errors.description = intl.formatMessage({ id: "page.body.p2p.advertisement.message.description" });
        }
        setErrors(_errors);
        return _errors;
    }

    const handleSubmit = async () => {
        const _errors = validate(formData);
        setIsSubmitted(true);
        if (Object.keys(_errors).length > 0) {
            return;
        }
        dispatch(p2pUpdateAdvertisementFetch(formData));
        onClose();
    }

    const handleChangeForm = (key: string, value: any) => {
        const _formData = { ...formData, [key]: value };
        setFormData(_formData);
        if (isSubmitted) {
            validate(_formData);
        }
    }

    return ( 
        <div className={`p2pcreate-add__body${isMobileDevice ? " mobile" : ""}`}>
            <div className="p2pcreate-add__body__infos">
                <div className="titles">
                    <p>{intl.formatMessage({ id: "page.body.p2p.advertisement.content.price" })}: </p>
                    <span>{formatNumber(advertisement.price)} {advertisement.fiat_currency.toUpperCase()}</span>
                </div>
                <div className="titles">
                    <p>{intl.formatMessage({ id: "page.body.p2p.advertisement.content.available" })}: </p>
                    <div className="available-balance">
                        <span>{Decimal.format(advertisement.amount, coinCurrency.precision, ",")}</span>
                        <p>{advertisement.coin_currency.toUpperCase()}</p>
                        <Link to={`/wallets/spot/${advertisement.coin_currency}/deposit`} className="deposit-link">
                            <DepositPlusIcon />
                        </Link>
                    </div>
                </div>
            </div>
            <div className="subtitle">
                {intl.formatMessage({ id: "page.body.p2p.advertisement.message.order_limit" })}
            </div>
            <div className="p2pcreate-add__body__row">
                <div className="p2pcreate-add__body__input">
                    <Input
                        type="number"
                        maxNumber={MAX_LIMIT_CURRENCY}
                        value={`${formData.min_amount}`}
                        placeholder="0.00"
                        onChange={(value) => handleChangeForm("min_amount", Number(value))}
                        suffix={
                            advertisement.coin_currency ? (
                                <React.Fragment>
                                    <p>{intl.formatMessage({ id: "page.body.p2p.advertisement.content.min" })}</p>
                                    <span>{advertisement.coin_currency.toUpperCase()}</span>
                                </React.Fragment> 
                            ) : null
                        }
                        error={errors.min_amount}
                        selectOnFocus
                    />
                    {errors.min_amount && <p className="text-sm text-red-500">{errors.min_amount}</p>}
                </div>
                <div className="between"> ~ </div>
                <div className="p2pcreate-add__body__input">
                    <Input
                        type="number"
                        maxNumber={MAX_LIMIT_CURRENCY}
                        value={`${formData.max_amount}`}
                        placeholder="0.00"
                        onChange={(value) => handleChangeForm("max_amount", Number(value))}
                        suffix={
                            advertisement.coin_currency ? (
                                <React.Fragment>
                                    <p>{intl.formatMessage({ id: "page.body.p2p.advertisement.content.max" })}</p>
                                    <span>{advertisement.coin_currency.toUpperCase()}</span>
                                </React.Fragment> 
                            ) : null
                        }
                        error={errors.max_amount}
                        selectOnFocus
                    />
                    {errors.max_amount && <p className="text-error">{errors.max_amount}</p>}
                </div>
            </div>
            <div className="subtitle">
                {intl.formatMessage({ id: "page.body.p2p.advertisement.content.payment_time_limit" })}
            </div>
            <div className="p2pcreate-add__body__input paytime">
                <SelectP2PFilter
                    searchAble={false}
                    suffixMarkup={intl.formatMessage({
                        id: "page.body.p2p.advertisement.content.payment_time_limit.time"
                    })}
                    options={[
                        { value: "10", label: "10 min" },
                        { value: "15", label: "15 min" },
                        { value: "30", label: "30 min" },
                        { value: "45", label: "45 min" },
                        { value: "60", label: "1 hr" },
                        { value: "120", label: "2 hr" },
                        { value: "180", label: "3 hr" },
                    ]}
                    value={`${formData.paytime}`}
                    onChange={(value) => handleChangeForm("paytime", Number(value))}
                    error={errors.paytime}
                />
                {errors.paytime && <p className="text-error">{errors.paytime}</p>}
            </div>
            <div className="subtitle">
                {intl.formatMessage({ id: "page.body.p2p.advertisement.content.remarks" })}
            </div>
            <TextArea
                rows={4}
                maxLength={255}
                value={formData.description ?? ""}
                placeholder={intl.formatMessage({
                    id: "page.body.p2p.advertisement.content.remarks.description"
                })}
                onChange={(value) => handleChangeForm("description", value)}
            />
            {errors.description && <p className="text-error">{errors.description}</p>}
            <div className="modal-window__buttons">
                <Button onClick={onClose} className="medium-button themes black">
                    {intl.formatMessage({ id: "page.body.p2p.advertisement.action.cancel" })}
                </Button>
                <Button disabled={!isDirtyForm} onClick={handleSubmit} className="medium-button themes">
                    {intl.formatMessage({ id: "page.body.p2p.advertisement.action.update" })}
                </Button>
            </div>
        </div>
    )
}

export default UpdateP2PAdsModal;