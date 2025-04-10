import React, { FC, ReactElement } from 'react';
import classnames from 'classnames'; 
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
 
import { selectUserInfo } from '../../modules';
 
import { KycCircle } from '../../assets/images/kyc/KycCircle';

export const ProfileVerificationLevels: FC = (): ReactElement =>   {
 
    const user = useSelector(selectUserInfo);

    const levelTitle = (user) => {
        if (user.level === 1) {
            return <span><FormattedMessage id="page.body.profile.account.level.description.levelone" /></span>;
        } else if (user.level === 2) {
            return <span><FormattedMessage id="page.body.profile.account.level.description.leveltwo" /></span>;
        } else if (user.level === 3) {
            return <span><FormattedMessage id="page.body.profile.account.level.description.levelthree" /></span>;
        }
    };


    const levelBasic = (user) => {
        if (user.level === 1) {
            return (
                <div className="verification-levels"> 
                    <div className="verification-levels__wrapper"> 
                        <div className="verification-levels__wrapper__number">{user.level}</div>
                        <div className="verification-levels__wrapper__name"> Basic </div>
                        <div className="verification-levels__wrapper__title"> <FormattedMessage id="page.body.profile.account.level.verification" /> </div> 
                    </div>
                </div>
            );
        } else if (user.level === 2) {
            return (
                <div className="verification-levels"> 
                    <div className="verification-levels__wrapper"> 
                        <div className="verification-levels__wrapper__number">{user.level}</div>
                        <div className="verification-levels__wrapper__name"> Plus </div>
                        <div className="verification-levels__wrapper__title"> <FormattedMessage id="page.body.profile.account.level.verification" /> </div> 
                    </div>
                </div>
            );
        } else if (user.level === 3) {
            return (
                <div className="verification-levels"> 
                    <div className="verification-levels__wrapper"> 
                        <div className="verification-levels__wrapper__number"> 3 </div>
                        <div className="verification-levels__wrapper__name"> Full </div>
                        <div className="verification-levels__wrapper__title"> <FormattedMessage id="page.body.profile.account.level.verification" /> </div> 
                    </div> 
                </div>
            );
        }
    };

    const levelCircle = (user) => {
        const languageClassName = classnames('verification-circle', {
            'verification-circle verification-circle-first': user.level === 1,
            'verification-circle verification-circle-second': user.level === 2,
            'verification-circle verification-circle-third': user.level === 3, 
        });
        return ( 
            <div className={languageClassName}> 
                <KycCircle />
            </div>
        );
    };

    return (
        <div className="profile-verification__levels">
            <div className="profile-verification__levels__title">
                <h1><FormattedMessage id="page.body.profile.header.account.profile" /></h1> 
                {levelTitle(user)}
            </div>  
            <div className="profile-verification__levels__circle"> 
                {levelBasic(user)} 
                {levelCircle(user)}
            </div> 
        </div>
    );
};

