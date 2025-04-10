import classnames from 'classnames';
import * as React from 'react';
import { DEFAULT_FIAT_PRECISION } from '../../../constants';
import { Decimal } from '../..';
import { useIntl } from 'react-intl';
import { platformCurrency } from 'src/api';

export interface BeneficiariesBlockchainItemProps {
    blockchainKey: string;
    protocol: string;
    name: string;
    id: string;
    fee: string;
    minWithdraw: string;
    fixed?: number;
    price?: string;
    disabled?: boolean;
    isHidden?: boolean;
}

export const BeneficiariesBlockchainItem: React.FunctionComponent<BeneficiariesBlockchainItemProps> = ({
    protocol,
    name,
    id,
    fee,
    minWithdraw,
    fixed,
    price,
    disabled,
}: BeneficiariesBlockchainItemProps) => {

    const { formatMessage } = useIntl();

    const estimatedFeeValue = React.useMemo(() => (+fee * +price), [fee, price]);

    const classname = classnames('beneficiaries-list-modal__item', {
        'beneficiaries-list-modal__item__disabled': disabled,
    });

    return (
        <React.Fragment>
            {!disabled && 
            <div className={classname} data-id={protocol}>
                <div className="beneficiaries-list-modal__item__block">
                    <h3 className="beneficiaries-list-modal__item__protocol">
                        {protocol?.toUpperCase()}
                        {disabled && <div className="disabled">
                            {formatMessage({ id: "page.body.wallets.beneficiaries.withdrawal.disabled" })}
                        </div>}
                    </h3>
                    <div className="name">{`${name} (${id.toUpperCase()})`}</div>
                    <div className="fee">
                        <span>{formatMessage({ id: "page.body.wallets.beneficiaries.network.fee" })}</span>
                        <Decimal fixed={fixed} thousSep=",">{fee?.toString()}</Decimal>&nbsp;{id.toUpperCase()}
                    </div>
                </div>
                <div className="beneficiaries-list-modal__item__block">
                    <div className="bold"><span>{formatMessage({ id: "page.body.wallets.beneficiaries.min.withdraw" })} </span>{minWithdraw}&nbsp;{id.toUpperCase()}</div>
                    <div className="secondary">≈<Decimal fixed={DEFAULT_FIAT_PRECISION} thousSep=",">{estimatedFeeValue.toString()}</Decimal> {platformCurrency()}</div>
                </div>
            </div>}
        </React.Fragment>
    );
}
