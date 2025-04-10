import React, { FC, ReactElement, useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useHistory, useParams } from 'react-router-dom'; 
import { WalletWrapes } from 'src/components/TabPanelUnderlines/WalletWrapes';
import { WalletsSpot, Sidebar, WalletsOverview, ProfileHeader } from 'src/containers'; 
import { useDocumentTitle, useWalletsFetch } from 'src/hooks';

interface ParamType {
    routeTab?: string;
    currency?: string;
    action?: string;
}

export const WalletsScreen: FC = (): ReactElement => {
    const [tab, setTab] = useState<string>('');
    const [tabMapping] = useState<string[]>(['overview', 'spot']);
    const [currentTabIndex, setCurrentTabIndex] = useState<number>(0);

    const history = useHistory();
    const { formatMessage } = useIntl();
    const translate = useCallback((id: string) => formatMessage({ id }), [formatMessage]);

    const { routeTab, currency, action } = useParams<ParamType>();

    useDocumentTitle(translate('page.header.navbar.wallets'));
    useWalletsFetch();
 
    useEffect(() => {
        if (routeTab) {
            const index = tabMapping.indexOf(routeTab);
            if (index !== -1) {
                setTab(routeTab);
                setCurrentTabIndex(index);
            }
        } else {
            history.push('/wallets/overview');
        }
    }, [routeTab, tabMapping]);
    
    const onCurrentTabChange = (index: number) => {
        setCurrentTabIndex(index);
        history.push(`/wallets/${tabMapping[index]}`);
    };

    const onTabChange = (index: number) => {
        if (tab !== tabMapping[index]) {
            setTab(tabMapping[index]);
        }
    };

    const renderTabs = () => {

        return [
            {
                content: currentTabIndex === 0 ? <WalletsOverview /> : null,
                label: translate('page.body.wallets.tab.overview'),
            },
            {
                content: currentTabIndex === 1 ? <WalletsSpot currency={currency} action={action}/> : null,
                label: translate('page.body.wallets.tab.spot'),
            },
        ];
    };

    return (
        <div className="accountpage-wrapper">
            <Sidebar />
            <div className="accountpage-wrapper__right">
                <ProfileHeader />
                <div className="wallets-page">
                    <WalletWrapes
                        panels={renderTabs()}
                        onTabChange={onTabChange}
                        currentTabIndex={currentTabIndex}
                        onCurrentTabChange={onCurrentTabChange}
                    />
                </div> 
            </div>
        </div> 
    );
};
