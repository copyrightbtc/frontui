import * as React from 'react';
import { useIntl } from 'react-intl';
import { TabPanelSliding } from 'src/components/TabPanelUnderlines/TabPanelSliding';
import { PassportIcon } from '../../../assets/images/customization/PassportIcon';
import { IdcardIcon } from '../../../assets/images/customization/IdcardIcon';
import { DrivelicenseIcon } from '../../../assets/images/customization/DrivelicenseIcon';

import { selectMobileDeviceState } from '../../../modules';
import { useReduxSelector } from '../../../hooks';

import { PassportIndex } from './PassportIndex';
import { IdentityCardIndex } from './IdentityCardIndex';
import { DriverLicanseIndex } from './DriverLicanseIndex';
 
export const Documents: React.FC = () => {
 
    const { formatMessage } = useIntl();

    const [value, setValue] = React.useState(null);

    const isMobileDevice = useReduxSelector(selectMobileDeviceState);
 
    const renderTabs = () => [
        {
            content: value === value ? <PassportIndex /> : null,
            label: <React.Fragment>
                    {!isMobileDevice && <PassportIcon />}
                    <span>{formatMessage({ id: 'page.body.kyc.documents.select.passport' })}</span>
                </React.Fragment>,
        },
        {
            content: value === value ? <IdentityCardIndex /> : null,
            label: <React.Fragment>
                    {!isMobileDevice && <IdcardIcon />}
                    <span>{formatMessage( { id: 'page.body.kyc.documents.select.identityCard' })}</span>
                </React.Fragment>,
        },
        {
            content: value === value ? <DriverLicanseIndex /> : null,
            label: <React.Fragment>
                    {!isMobileDevice && <DrivelicenseIcon />}
                    <span>{formatMessage( { id: 'page.body.kyc.documents.select.driverLicense' })}</span>
                </React.Fragment>,
        },
    ];
 
  return (
    <div className="verification-modal__content__documents">
        {value === null && (
            <div className="verification-modal__content__documents__maintitle">
                {formatMessage({ id: 'page.body.kyc.documents.select.conditions.maintitle' })}
            </div> 
        )}
        <TabPanelSliding
            panels={renderTabs()}
            currentTabIndex={value}
            onCurrentTabChange={setValue}
        />
        {value === null && (
            <div className="verification-modal__content__documents__warn"> 
                <h5>{formatMessage({ id: 'page.body.kyc.documents.select.conditions.title' })}</h5>
                <span>{formatMessage({ id: 'page.body.kyc.documents.select.conditions.feature' })}</span>
            </div> 
        )}
    </div>
  );
};
