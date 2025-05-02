import React, { useCallback } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { OverlayTrigger } from 'react-bootstrap';
import { Tooltip, Decimal } from 'src/components';
import { Button } from '@mui/material';
import Accordion from 'react-bootstrap/Accordion';
import { ArrowDownward } from 'src/assets/images/ArrowDownward';
import { CopyIcon } from 'src/assets/images/CopyIcon';
import { InfoIcon } from 'src/assets/images/InfoIcon';
import { VerifiedIcon } from 'src/assets/images/VerifiedIcon';
import { UnVerifiedIcon } from 'src/assets/images/UnVerifiedIcon';
import { useUserWithdrawalsFetch, useFeeGroupFetch, useWithdrawLimits, useMemberFees } from 'src/hooks';
import { copyToClipboard, truncateMiddle, truncateEmail } from 'src/helpers';
import {
    alertPush,
    selectWithdrawLimits,
    selectFeeGroup,
    selectUserInfo,
    selectMemberFees,
    selectUserWithdrawalLimitsDay,
    selectUserWithdrawalLimitsMonth,
} from 'src/modules';
import { DEFAULT_FIAT_PRECISION } from 'src/constants';  

const UserInfoComponent = props => {
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();
    useUserWithdrawalsFetch();
    useFeeGroupFetch();
    useWithdrawLimits();
    useMemberFees();

    const withdrawLimit = useSelector(selectWithdrawLimits);
    const usedWithdrawalLimitDay = useSelector(selectUserWithdrawalLimitsDay);
    const usedWithdrawalLimitMonth = useSelector(selectUserWithdrawalLimitsMonth);
    const feeGroup = useSelector(selectFeeGroup);
    const user = useSelector(selectUserInfo);
    const translate = useCallback((id: string) => formatMessage({ id }), [formatMessage]);
    const currentUserWithdrawalLimitGroup = withdrawLimit?.find(item => item.group === feeGroup.group) || withdrawLimit?.find(item => item.group === 'any');
    const estimatedValueDay = Number(currentUserWithdrawalLimitGroup?.limit_24_hour);
    const estimatedValueMonth = Number(currentUserWithdrawalLimitGroup?.limit_1_month);

    const memberfee = useSelector(selectMemberFees);
    const memberfeeGroup = memberfee?.find(item => item.group === feeGroup.group);

    const leftAmountDay = Number(estimatedValueDay.toString()) - Number(usedWithdrawalLimitDay.toString());
    const leftAmountMonth = Number(estimatedValueMonth.toString()) - Number(usedWithdrawalLimitMonth.toString());

    const link = `${window.location.origin}/signup?referral_uid=${user.uid}`;

    const copyLink = () => {
      copyToClipboard(link);
      dispatch(alertPush({ message: ['success.invite.copied.link'], type: 'success'}))
    };

    const levelTitle = (user) => {
        if (user.level === 1) {
            return (
                <div className="profile-userinfo__verification__level-1">
                    <Button
                        href='/profile/verification'
                        className="verif_level"
                        sx={{
                            color: 'var(--color-dark)',
                            '&:hover': {
                                color: 'var(--color-accent)'
                            }

                        }}
                    >
                        {formatMessage({ id: 'page.body.profile.header.account.unverified' })}
                        <UnVerifiedIcon />
                    </Button> 
                </div>
            );
        } else if (user.level === 2) {
            return (
                <div className="profile-userinfo__verification__level-2">
                    <Button
                        href='/profile/verification'
                        className="verif_level"
                        sx={{
                            color: 'var(--color-dark)',
                            '&:hover': {
                                color: 'var(--color-accent)'
                            }

                        }}
                    >   
                        {formatMessage({ id: 'page.body.profile.header.account.finishVerification' })}
                        <UnVerifiedIcon /> 
                    </Button>
                </div> 
            );
        } else if (user.level === 3) {
            return (
                <div className="profile-userinfo__verification__level-3">
                    <div className="verified">
                        <VerifiedIcon className='ver-icon'/> 
                        {formatMessage({ id: 'page.body.profile.header.account.verified' })}  
                    </div>
                </div> 
            );
        }
    };

    return (
        <div className="mobile-user-info">
            <div className="mobile-user-info__header">
                <h2>{translate('page.body.profile.header.account.information')}</h2>
                <div className="profile-userinfo__verification"> 
                    {levelTitle(user)}
                </div>
            </div>
            <div className="mobile-user-info__block shadow">
                <div className="mobile-user-info__block__row">
                    <h5>{translate('page.body.profile.header.account.login')}: </h5>
                    <span>{truncateEmail(user.email)}</span>
                </div>
                <div className="mobile-user-info__block__row">
                    <h5>UID:</h5>
                    <span>{user.uid}</span>
                </div>
                {user.username && user.username !== 'anonymous' ? 
                <div className="mobile-user-info__block__row">
                    <h5>Username:</h5>
                    <span>{user.username}</span>
                </div> : null}
                <Accordion>
                    <Accordion.Item eventKey="1">
                        <Accordion.Header>
                            {translate('page.body.profile.content.action.more')}
                            <ArrowDownward className="arrow" />
                        </Accordion.Header>
                        <Accordion.Body>
                            <div className="mobile-user-info__block__row">
                                <h5>{translate('page.body.profile.header.account.group')}: </h5>
                                <span className="flex">
                                    {feeGroup.group} 
                                    <OverlayTrigger 
                                        placement="auto"
                                        delay={{ show: 250, hide: 300 }} 
                                        overlay={<Tooltip className="themes" title="page.body.wallets.tabs.withdraw.content.withdrawal.limit.groupfee" />}>
                                            <div className="tip_icon_container">
                                                <InfoIcon />
                                            </div>
                                    </OverlayTrigger>
                                </span>
                            </div>
                            <div className="mobile-user-info__block__row">
                                <h5>{translate('page.body.feeslend.fee.tablspan2')}:</h5>
                                <span className="fees">{Number(memberfeeGroup?.maker) * 100}%</span>
                            </div>
                            <div className="mobile-user-info__block__row">
                                <h5>{translate('page.body.feeslend.fee.tablspan3')}:</h5>
                                <span className="fees">{Number(memberfeeGroup?.taker) * 100}%</span>
                            </div>
                            <h2 className='title'>
                                {translate('page.body.wallets.tabs.withdraw.content.withdrawal.limit')}
                                <OverlayTrigger
                                    placement="auto"
                                    delay={{ show: 250, hide: 300 }} 
                                    overlay={<Tooltip className="themes" title="page.body.wallets.tabs.withdraw.content.withdrawal.limit.tip" />}>
                                        <div className="tip_icon_container">
                                            <InfoIcon />
                                        </div>
                                </OverlayTrigger>
                            </h2>
                            <div className="mobile-user-info__block__row">
                                <h5>{formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.withdrawal.total.24' })}</h5>
                                <span>
                                    $<Decimal fixed={DEFAULT_FIAT_PRECISION} thousSep=",">{estimatedValueDay.toString()}</Decimal>
                                </span>
                            </div>
                            <div className="mobile-user-info__block__row">
                                <h5>{formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.withdrawal.done.24' })}</h5>
                                <span className="danger">
                                    ≈ $<Decimal fixed={DEFAULT_FIAT_PRECISION} thousSep=",">{usedWithdrawalLimitDay.toString()}</Decimal>
                                </span>
                            </div>
                            <div className="mobile-user-info__block__row">
                                <h5>{formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.withdrawal.left.24' })}</h5>
                                <span className="accent">
                                    {leftAmountDay > 0 ? 
                                    `≈ $${Decimal.format(leftAmountDay, DEFAULT_FIAT_PRECISION, ',')}` : 
                                        formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.withdrawal.reached' })}
                                </span>
                            </div>
                            <hr></hr>
                            <div className="mobile-user-info__block__row">
                                <h5>{formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.withdrawal.total.month' })}</h5>
                                <span>
                                    $<Decimal fixed={DEFAULT_FIAT_PRECISION} thousSep=",">{estimatedValueMonth.toString()}</Decimal>
                                </span>
                            </div>
                            <div className="mobile-user-info__block__row">
                                <h5>{formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.withdrawal.done.month' })}</h5>
                                <span className="danger">
                                    ≈ $<Decimal fixed={DEFAULT_FIAT_PRECISION} thousSep=",">{usedWithdrawalLimitMonth.toString()}</Decimal>
                                </span>
                            </div>
                            <div className="mobile-user-info__block__row">
                                <h5>{formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.withdrawal.left.month' })}</h5>
                                <span className="accent">
                                    {leftAmountMonth > 0 ? 
                                    `≈ $${Decimal.format(leftAmountMonth, DEFAULT_FIAT_PRECISION, ',')}` : 
                                        formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.withdrawal.reached' })}
                                </span>
                            </div>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </div>
            <div className="mobile-user-info__column">
                <h4>{translate('page.body.invite.default_link')}</h4>
                <div className="copy-field">
                    <div className="copy-field__text">{truncateMiddle(link, 38)}</div> 
                    <Button
                        onClick={copyLink}
                        className="mobile-copy-button"
                    >
                        <CopyIcon /> 
                    </Button>
                </div>
            </div>
        </div>
    );
};

export const UserInfo = React.memo(UserInfoComponent);
