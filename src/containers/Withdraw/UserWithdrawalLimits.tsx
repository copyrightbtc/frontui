import { OverlayTrigger } from 'react-bootstrap';
import Accordion from 'react-bootstrap/Accordion';
import React, { useCallback } from 'react';
import { ArrowDownward } from 'src/assets/images/ArrowDownward';
import { useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import { InfoIcon } from 'src/assets/images/InfoIcon';
import { Tooltip, Decimal } from '../../components';
import { useUserWithdrawalsFetch, useFeeGroupFetch, useWithdrawLimits } from '../../hooks';
import {
    selectWithdrawLimits,
    selectFeeGroup,
    selectUserWithdrawalLimitsDay,
    selectUserWithdrawalLimitsMonth,    
} from '../../modules';
import { DEFAULT_FIAT_PRECISION } from '../../constants';

interface UserWithdrawalLimitsProps {
    currencyId: string;
    price: string;
    fixed: number;
}

export const UserWithdrawalLimits = React.memo((props: UserWithdrawalLimitsProps) => {
    const { fixed, price, currencyId } = props;
    const { formatMessage } = useIntl();

    useUserWithdrawalsFetch();
    useFeeGroupFetch();
    useWithdrawLimits();

    const withdrawLimit = useSelector(selectWithdrawLimits);
    const usedWithdrawalLimitDay = useSelector(selectUserWithdrawalLimitsDay);
    const usedWithdrawalLimitMonth = useSelector(selectUserWithdrawalLimitsMonth);
    const feeGroup = useSelector(selectFeeGroup);

    const translate = (id: string) => formatMessage({ id });

    const currentUserWithdrawalLimitGroup = withdrawLimit?.find(item => item.group === feeGroup.group) || withdrawLimit?.find(item => item.group === 'any');

    const estimatedValueDay = (+currentUserWithdrawalLimitGroup?.limit_24_hour - +usedWithdrawalLimitDay) / +price;
    const estimatedValueMonth = (+currentUserWithdrawalLimitGroup?.limit_1_month - +usedWithdrawalLimitMonth) / +price;

    const leftAmountDay = +currentUserWithdrawalLimitGroup?.limit_24_hour - +usedWithdrawalLimitDay
    const leftAmountMonth = +currentUserWithdrawalLimitGroup?.limit_1_month - +usedWithdrawalLimitMonth
        
    return (
        <div className="withdraw-container__limits">
            <Accordion>
                <Accordion.Item eventKey="0">
                    <Accordion.Header>
                        <h5>
                            {translate('page.body.wallets.tabs.withdraw.content.withdrawal.limit')}
                            <OverlayTrigger
                                placement="auto"
                                delay={{ show: 250, hide: 300 }}
                                overlay={<Tooltip title="page.body.wallets.tabs.withdraw.content.withdrawal.limit.tip" />}>
                                <div className="tip_icon_container">
                                    <InfoIcon />
                                </div>
                            </OverlayTrigger>
                        </h5> 
                        <ArrowDownward className="arrow" />
                    </Accordion.Header>
                    <Accordion.Body>
                        <div className="withdraw-container__row column">
                            <span>{translate('page.body.wallets.tabs.withdraw.content.withdrawal.limit.day')}</span>
                            <div className="withdraw-container__row__details">
                                {leftAmountDay > 0 ? 
                                    <React.Fragment>
                                        <div><Decimal fixed={fixed} thousSep=",">{estimatedValueDay.toString()}</Decimal>&nbsp;{currencyId.toUpperCase()}</div>
                                        <small>≈ $<Decimal fixed={DEFAULT_FIAT_PRECISION} thousSep=",">{leftAmountDay}</Decimal></small>
                                        </React.Fragment>
                                    : <span className="accent">{formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.withdrawal.reached.limit' })}</span>}
                            </div>
                        </div>
                        <div className="withdraw-container__row column">
                            <span>{translate('page.body.wallets.tabs.withdraw.content.withdrawal.limit.month')}</span>
                            <div className="withdraw-container__row__details">
                                {leftAmountMonth > 0 ? 
                                    <React.Fragment>
                                        <div><Decimal fixed={fixed} thousSep=",">{estimatedValueMonth.toString()}</Decimal>&nbsp;{currencyId.toUpperCase()}</div>
                                        <small>≈ $<Decimal fixed={DEFAULT_FIAT_PRECISION} thousSep=",">{leftAmountMonth}</Decimal></small>
                                        </React.Fragment>
                                    : <span className="accent">{formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.withdrawal.reached.limit' })}</span>}
                            </div>
                        </div>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </div>
    );
});
