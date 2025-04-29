import * as React from 'react';

export interface Panel {
    content: React.ReactNode;
}

export interface OrderPanelEtendedProps {
    panels: Panel[];
}

export const OrderPanelEtended: React.FC<OrderPanelEtendedProps> = ({
    panels,
}) => {
 
    const renderTabContent = (tab: Panel) => {
        return tab.content;
    };

    return (
        <React.Fragment>
            {panels.map(renderTabContent)}
        </React.Fragment>
    );
};
