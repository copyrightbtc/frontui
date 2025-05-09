import * as React from 'react';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router';
import { TabPanelMobile } from '../../../components/TabPanelMobile';
import { HistoryTable } from '../../components/HistoryTable';

const WalletsHistory: React.FC = () => {
    const intl = useIntl();
    const { currency = '' } = useParams<{ currency?: string }>();
    const [currentTabs, setCurrentTabs] = React.useState(0);

    const renderTabs = () => [
        {
            content: currentTabs === 0 ? <HistoryTable currency={currency} type="deposits" /> : null,
            label: intl.formatMessage({ id: 'page.mobile.wallets.deposit.history' }),
        },
        {
            content: currentTabs === 1 ? <HistoryTable currency={currency} type="withdraws" /> : null,
            label: intl.formatMessage( { id: 'page.mobile.wallets.withdraw.history' }),
        },
    ];

    return (
        <TabPanelMobile
            panels={renderTabs()}
            currentTabs={currentTabs}
            onCurrentTabChange={setCurrentTabs}
            borders={true}
        />
    );
};

export {
    WalletsHistory,
};

