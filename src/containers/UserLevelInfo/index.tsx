import { OverlayTrigger } from 'react-bootstrap';
import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import { Tooltip, Decimal } from '../../components';
import { Button } from '@mui/material';
import { InfoIcon } from 'src/assets/images/InfoIcon';
import { VerifiedIcon } from 'src/assets/images/VerifiedIcon';
import { UnVerifiedIcon } from 'src/assets/images/UnVerifiedIcon';
import { useUserWithdrawalsFetch, useFeeGroupFetch, useWithdrawLimits, useMemberFees } from '../../hooks';
import { truncateEmail } from '../../helpers';
import {
    selectWithdrawLimits,
    selectFeeGroup,
    selectUserInfo,
    selectMemberFees,
    selectUserWithdrawalLimitsDay,
    selectUserWithdrawalLimitsMonth,
} from '../../modules';
import { DEFAULT_FIAT_PRECISION } from '../../constants';  

interface UserLevelInfoProps { 
    fixed: number;
}

const UserLevelInfo = React.memo((props: UserLevelInfoProps)  => {

    const { formatMessage } = useIntl();

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

    const canvasRefMonth = React.useRef<HTMLCanvasElement>(null);
    const canvasRefDay = React.useRef<HTMLCanvasElement>(null);
 
    const draw = (ctx, usedLimit, limit) => {
        const rad = (+usedLimit * 100) / +limit;
        const offset = Math.PI * 1.5;
        const angle = (Math.PI * 2 * +rad) / 100;
        const end = angle + offset + 0.1; 

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); 
        ctx.beginPath();
        ctx.strokeStyle = '#eff501';
        ctx.lineWidth = 4;
        ctx.arc(21, 24, 18, offset, 100);
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = '#f70000';
        ctx.lineWidth = 4;
        ctx.arc(21, 24, 18, offset, end);
        ctx.stroke();
    };

    React.useEffect(() => {
        const context = canvasRefDay.current && canvasRefDay.current.getContext('2d');
        const render = () => { 
            draw(context, usedWithdrawalLimitDay, currentUserWithdrawalLimitGroup?.limit_24_hour);
        }; 
        render();

    }, [usedWithdrawalLimitDay, currentUserWithdrawalLimitGroup]);

    React.useEffect(() => {
        const context = canvasRefMonth.current && canvasRefMonth.current.getContext('2d');
        const render = () => { 
            draw(context, usedWithdrawalLimitMonth, currentUserWithdrawalLimitGroup?.limit_1_month); 
        }; 
        render();

    }, [usedWithdrawalLimitMonth, currentUserWithdrawalLimitGroup]);

    const leftAmountDay = Number(estimatedValueDay.toString()) - Number(usedWithdrawalLimitDay.toString());
    const leftAmountMonth = Number(estimatedValueMonth.toString()) - Number(usedWithdrawalLimitMonth.toString());

    const levelTitle = (user) => {
        if (user.level === 1) {
            return (
                <div className="profile-userinfo__verification__level-1">
                    <Button
                        onClick={() => document.getElementById('prof-ver')?.scrollIntoView({behavior: 'smooth'})}
                        className="verif_level"
                        sx={{
                            color: '#fff',
                            '&:hover': {
                                color: 'var(--accent)'
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
                        onClick={() => document.getElementById('prof-ver')?.scrollIntoView({behavior: 'smooth'})}
                        className="verif_level"
                        sx={{
                            color: '#fff',
                            '&:hover': {
                                color: 'var(--accent)'
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
        <React.Fragment>
            <div className="profile-section">
                <div className="profile-section__content">
                    <div className="profile-section__content__header">
                        <div className="profile-section__content__header__rows">
                            <h2 className="h2__withchild">{translate('page.body.profile.header.account.information')}
                                <div className="profile-userinfo__verification"> 
                                    {levelTitle(user)}
                                </div>
                            </h2>
                        </div>
                        <div className="profile-section__content__header__rows">
                            <h2 className="h2__withchild">
                                {translate('page.body.wallets.tabs.withdraw.content.withdrawal.limit')}
                                <OverlayTrigger
                                    placement="auto"
                                    delay={{ show: 250, hide: 300 }} 
                                    overlay={<Tooltip title="page.body.wallets.tabs.withdraw.content.withdrawal.limit.tip" />}>
                                        <div className="tip_icon_container">
                                            <InfoIcon />
                                        </div>
                                </OverlayTrigger> 
                            </h2> 
                        </div>
                    </div>
                    <div className="profile-userinfo"> 
                        <div className="profile-userinfo__left"> 
                            <div className="profile-userinfo__column">
                                <h5>{translate('page.body.profile.header.account.login')}: </h5>
                                <span>{truncateEmail(user.email)}</span>
                            </div>
                            <div className="profile-userinfo__column">
                                <h5>UID:</h5>
                                <span>{user.uid}</span>
                            </div>
                            {user.username && user.username !== 'anonymous' ? 
                            <div className="profile-userinfo__column">
                                <h5>Username:</h5>
                                <span>{user.username}</span>
                            </div> : null}
                            <div className="profile-userinfo__column">
                                <h5>{translate('page.body.profile.header.account.group')}: </h5>
                                <span className="flex items-center">
                                    {feeGroup.group} 
                                    <OverlayTrigger 
                                        placement="auto"
                                        delay={{ show: 250, hide: 300 }} 
                                        overlay={<Tooltip title="page.body.wallets.tabs.withdraw.content.withdrawal.limit.groupfee" />}>
                                            <div className="tip_icon_container">
                                                <InfoIcon />
                                            </div>
                                    </OverlayTrigger>
                                    </span>
                            </div> 
                            <div className="profile-userinfo__column fees">
                                <h5>{translate('page.body.feeslend.fee.tablspan2')}:</h5>
                                <span>{Number(memberfeeGroup?.maker) * 100}%</span>
                            </div>
                            <div className="profile-userinfo__column fees">
                                <h5>{translate('page.body.feeslend.fee.tablspan3')}:</h5>
                                <span>{Number(memberfeeGroup?.taker) * 100}%</span>
                            </div>
                        </div>
                        <div className="profile-userinfo__right">
                            <div className="profile-userinfo__withdraws">
                                <h4>{formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.withdrawal.day' })}</h4>
                                <div className="profile-userinfo__withdraws__canvas">
                                    <canvas ref={canvasRefDay} {...props} width={45} height={45}/>
                                </div>
                                <div className="profile-userinfo__withdraws__infos">
                                    <div className="profile-userinfo__withdraws__row">
                                        <h5>
                                            {formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.withdrawal.total' })}
                                            <OverlayTrigger
                                                placement="auto"
                                                delay={{ show: 250, hide: 300 }} 
                                                overlay={<Tooltip title="page.body.wallets.tabs.withdraw.content.withdrawal.day.tip.total" />}>
                                                    <div className="tip_icon_container">
                                                        <strong>?</strong>
                                                    </div>
                                            </OverlayTrigger> 
                                        </h5>
                                        <span>
                                            $<Decimal fixed={DEFAULT_FIAT_PRECISION} thousSep=",">{estimatedValueDay.toString()}</Decimal>
                                        </span>
                                    </div>
                                    <div className="profile-userinfo__withdraws__row">
                                        <h5>
                                            {formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.withdrawal.done' })}
                                            <OverlayTrigger
                                                placement="auto"
                                                delay={{ show: 250, hide: 300 }} 
                                                overlay={<Tooltip title="page.body.wallets.tabs.withdraw.content.withdrawal.day.tip.done" />}>
                                                    <div className="tip_icon_container">
                                                        <strong>?</strong>
                                                    </div>
                                            </OverlayTrigger> 
                                        </h5>
                                        <span className="danger">
                                            ≈ $<Decimal fixed={DEFAULT_FIAT_PRECISION} thousSep=",">{usedWithdrawalLimitDay.toString()}</Decimal>
                                        </span>
                                    </div>
                                    <div className="profile-userinfo__withdraws__row">
                                        <h5>
                                            {formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.withdrawal.left' })}
                                            <OverlayTrigger
                                                placement="auto"
                                                delay={{ show: 250, hide: 300 }} 
                                                overlay={<Tooltip title="page.body.wallets.tabs.withdraw.content.withdrawal.day.tip.left" />}>
                                                    <div className="tip_icon_container">
                                                        <strong>?</strong>
                                                    </div>
                                            </OverlayTrigger> 
                                        </h5>
                                        <span className="accent">
                                            {leftAmountDay > 0 ? 
                                            `≈ $${Decimal.format(leftAmountDay, DEFAULT_FIAT_PRECISION, ',')}` : 
                                                formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.withdrawal.reached' })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="profile-userinfo__withdraws">
                                <h4>{formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.withdrawal.month' })}</h4>
                                <div className="profile-userinfo__withdraws__canvas"> 
                                    <canvas ref={canvasRefMonth} {...props} width={45} height={45}/>
                                </div>
                                <div className="profile-userinfo__withdraws__infos">
                                    <div className="profile-userinfo__withdraws__row">
                                        <h5>
                                            {formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.withdrawal.total' })}
                                            <OverlayTrigger
                                                placement="auto"
                                                delay={{ show: 250, hide: 300 }} 
                                                overlay={<Tooltip title="page.body.wallets.tabs.withdraw.content.withdrawal.month.tip.total" />}>
                                                    <div className="tip_icon_container">
                                                        <strong>?</strong>
                                                    </div>
                                            </OverlayTrigger> 
                                        </h5>
                                        <span>
                                            $<Decimal fixed={DEFAULT_FIAT_PRECISION} thousSep=",">{estimatedValueMonth.toString()}</Decimal>
                                        </span>
                                    </div>
                                    <div className="profile-userinfo__withdraws__row">
                                        <h5>
                                            {formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.withdrawal.done' })}
                                            <OverlayTrigger
                                                placement="auto"
                                                delay={{ show: 250, hide: 300 }} 
                                                overlay={<Tooltip title="page.body.wallets.tabs.withdraw.content.withdrawal.month.tip.done" />}>
                                                    <div className="tip_icon_container">
                                                        <strong>?</strong>
                                                    </div>
                                            </OverlayTrigger> 
                                        </h5>
                                        <span className="danger">
                                            ≈ $<Decimal fixed={DEFAULT_FIAT_PRECISION} thousSep=",">{usedWithdrawalLimitMonth.toString()}</Decimal>
                                        </span>
                                    </div>
                                    <div className="profile-userinfo__withdraws__row">
                                        <h5>
                                            {formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.withdrawal.left' })}
                                            <OverlayTrigger
                                                placement="auto"
                                                delay={{ show: 250, hide: 300 }} 
                                                overlay={<Tooltip title="page.body.wallets.tabs.withdraw.content.withdrawal.month.tip.left" />}>
                                                    <div className="tip_icon_container">
                                                        <strong>?</strong>
                                                    </div>
                                            </OverlayTrigger> 
                                        </h5>
                                        <span className="accent">
                                            {leftAmountMonth > 0 ? 
                                            `≈ $${Decimal.format(leftAmountMonth, DEFAULT_FIAT_PRECISION, ',')}` : 
                                                formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.withdrawal.reached' })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
});


export {
    UserLevelInfo,
};

/*
    const draw = useCallback((ctx, usedLimit, limit) => {
        const rad = (+usedLimit * 100) / +limit;
        const end = 100;

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); 
        ctx.beginPath();
        ctx.fillStyle = '#eff501';
        ctx.lineWidth = 4;
        ctx.fillRect(0, 0, rad, ctx.canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 4;
        ctx.fillRect(0, 0, end, ctx.canvas.height);
        ctx.stroke();
        
    }, [usedWithdrawalLimitDay, usedWithdrawalLimitMonth, currentUserWithdrawalLimitGroup]);
*/