import * as React from 'react';
import { OrdersData, TableOrders } from './TableOrders';

export interface OrderBookProps {
    data: OrdersData[][];
    maxVolume?: number;
    orderBookEntry?: number[];
    headers?: string[];
    classNames?: React.ReactNode;
    rowBackgroundColor?: string;
    onSelect: (orderIndex: string) => void;
}

export const mapValues = (maxVolume?: number, data?: number[]) => {
    const resultData = data && maxVolume && data.length ? data.map(currentVolume => {
        // tslint:disable-next-line:no-magic-numbers
        return { value: (currentVolume / maxVolume) * 100};
    }) : [];

    return resultData;
};

export class OrderBook extends React.PureComponent<OrderBookProps> {
    public render() {
        const {
            data,
            maxVolume,
            orderBookEntry,
            headers,
            rowBackgroundColor,
            onSelect,
            classNames,
        } = this.props;
        const resultData = mapValues(maxVolume, orderBookEntry);

        const getRowWidth = (index: number) => {
            if (resultData && resultData.length) {
                return {
                    width: `${resultData[index].value}%`,
                };
            }

            return {
                display: 'none',
            };
        };

        return (
            <div className={`order-book-block ${classNames}`}>
                <TableOrders
                    rowBackground={getRowWidth}
                    data={data}
                    header={headers}
                    rowBackgroundColor={rowBackgroundColor}
                    onSelect={onSelect}
                />
            </div>
        );
    }
}
