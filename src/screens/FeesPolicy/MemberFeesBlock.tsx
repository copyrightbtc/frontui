import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useIntl } from 'react-intl'; 
import { useFeeGroupFetch, useMemberFees } from '../../hooks';
import {
    selectFeeGroup,
    selectMemberFees,
} from '../../modules'; 
 
export const MemberFeesBlock: React.FC = () => {

    const { formatMessage } = useIntl();

    useFeeGroupFetch();
    useMemberFees();

    const feeGroup = useSelector(selectFeeGroup);
    const translate = useCallback((id: string) => formatMessage({ id }), [formatMessage]);

    const memberfee = useSelector(selectMemberFees);
    const memberfeeGroup1 = useMemo(() => memberfee?.find(item => item.group === "vip-0"), [memberfee, feeGroup]);
    const memberfeeGroup2 = useMemo(() => memberfee?.find(item => item.group === "vip-1"), [memberfee, feeGroup]);
    const memberfeeGroup3 = useMemo(() => memberfee?.find(item => item.group === "vip-2"), [memberfee, feeGroup]);
    const memberfeeGroup4 = useMemo(() => memberfee?.find(item => item.group === "vip-3"), [memberfee, feeGroup]);
    const memberfeeGroup5 = useMemo(() => memberfee?.find(item => item.group === "vip-4"), [memberfee, feeGroup]);
    const memberfeeGroup6 = useMemo(() => memberfee?.find(item => item.group === "vip-5"), [memberfee, feeGroup]);
    const memberfeeGroup7 = useMemo(() => memberfee?.find(item => item.group === "vip-6"), [memberfee, feeGroup]);
    const memberfeeGroup8 = useMemo(() => memberfee?.find(item => item.group === "vip-7"), [memberfee, feeGroup]);
    const memberfeeGroup9 = useMemo(() => memberfee?.find(item => item.group === "vip-8"), [memberfee, feeGroup]);

    return (
        <React.Fragment>
            <div className="flex-container">
                <div className="flex_3">
                    <span>{translate('page.body.feeslend.fee.tablspan1')}</span>
                </div> 
                <div className="flex_3">
                    <span>{translate('page.body.feeslend.fee.tablspan2')}</span>
                </div>
                <div className="flex_3">
                    <span>{translate('page.body.feeslend.fee.tablspan3')}</span>
                </div>
            </div>
            <div className="flex-container">
                <div className="flex_3">
                    <span>$1,000,000.00</span>
                </div> 
                <div className="flex_3">
                    <span>{Number(memberfeeGroup1?.maker) * 100}%</span>
                </div>
                <div className="flex_3">
                    <span>{Number(memberfeeGroup1?.taker) * 100}%</span>
                </div>
            </div>
            <div className="flex-container">
                <div className="flex_3">
                    <span>$1,000,000.00 {translate('page.body.feeslend.fee.mortrad')}</span>
                </div> 
                <div className="flex_3">
                    <span>{Number(memberfeeGroup2?.maker) * 100}%</span>
                </div>
                <div className="flex_3">
                    <span>{Number(memberfeeGroup2?.taker) * 100}%</span>
                </div>
            </div>
            <div className="flex-container">
                <div className="flex_3">
                    <span>$2,500,000.00 {translate('page.body.feeslend.fee.mortrad')}</span>
                </div> 
                <div className="flex_3">
                    <span>{Number(memberfeeGroup3?.maker) * 100}%</span>
                </div>
                <div className="flex_3">
                    <span>{Number(memberfeeGroup3?.taker) * 100}%</span>
                </div>
            </div>
            <div className="flex-container">
                <div className="flex_3">
                    <span>$5,000,000.00 {translate('page.body.feeslend.fee.mortrad')}</span>
                </div> 
                <div className="flex_3">
                    <span>{Number(memberfeeGroup4?.maker) * 100}%</span>
                </div>
                <div className="flex_3">
                    <span>{Number(memberfeeGroup4?.taker) * 100}%</span>
                </div>
            </div>
            <div className="flex-container">
                <div className="flex_3">
                    <span>$7,500,000.00 {translate('page.body.feeslend.fee.mortrad')}</span>
                </div> 
                <div className="flex_3">
                    <span>{Number(memberfeeGroup5?.maker) * 100}%</span>
                </div>
                <div className="flex_3">
                    <span>{Number(memberfeeGroup5?.taker) * 100}%</span>
                </div>
            </div>
            <div className="flex-container">
                <div className="flex_3">
                    <span>$10,000,000.00 {translate('page.body.feeslend.fee.mortrad')}</span>
                </div> 
                <div className="flex_3">
                    <span>{Number(memberfeeGroup6?.maker) * 100}%</span>
                </div>
                <div className="flex_3">
                    <span>{Number(memberfeeGroup6?.taker) * 100}%</span>
                </div>
            </div>
            <div className="flex-container">
                <div className="flex_3">
                    <span>$15,000,000.00 {translate('page.body.feeslend.fee.mortrad')}</span>
                </div> 
                <div className="flex_3">
                    <span>{Number(memberfeeGroup7?.maker) * 100}%</span>
                </div>
                <div className="flex_3">
                    <span>{Number(memberfeeGroup7?.taker) * 100}%</span>
                </div>
            </div>
            <div className="flex-container">
                <div className="flex_3">
                    <span>$20,000,000.00 {translate('page.body.feeslend.fee.mortrad')}</span>
                </div> 
                <div className="flex_3">
                    <span>{Number(memberfeeGroup8?.maker) * 100}%</span>
                </div>
                <div className="flex_3">
                    <span>{Number(memberfeeGroup8?.taker) * 100}%</span>
                </div>
            </div>
            <div className="flex-container">
                <div className="flex_3">
                    <span>$30,000,000.00 {translate('page.body.feeslend.fee.mortrad')}</span>
                </div> 
                <div className="flex_3">
                    <span>{Number(memberfeeGroup9?.maker) * 100}%</span>
                </div>
                <div className="flex_3">
                    <span>{Number(memberfeeGroup9?.taker) * 100}%</span>
                </div>
            </div>
        </React.Fragment>
    );
};
 