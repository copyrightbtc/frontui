import * as React from 'react';
import { useIntl } from 'react-intl';
import { NoResultData } from 'src/components';

export type CellDataOrders = string | number | React.ReactNode | undefined;

export interface TableState {
    selectedRowKey?: string;
}

export interface TableProps {
    data: CellDataOrders[][];
    header?: React.ReactNode[];
    rowKeyIndex?: number;
    selectedKey?: string;
    onSelect?: (key: string) => void;
}
 
export const TradeOrdersTable: React.FC<TableProps> = (props: TableProps) => {
    const { formatMessage } = useIntl();
    const [selectedRowKey, setSelectedRowKey] = React.useState<TableState['selectedRowKey']>(props.selectedKey);

    const {
        data,
        rowKeyIndex,
        onSelect,
        header,
    } = props;

    const handleSelect = React.useCallback((key: string) => () => {
        if (onSelect) {
            setSelectedRowKey(key);

            if (onSelect) {
                onSelect(key);
            }
        }
    }, [onSelect]);

    const renderHead = React.useCallback((row: CellDataOrders[]) => {
        const cells = row.map((c, index) => c ? <div className='cells'>{c}</div> : <div className='cells' key={index}>&nbsp;</div>);
        return (
            <div className='trade-orders__table__head'>
                {cells}
            </div>
        );
    }, []);

    const renderRowCells = React.useCallback((row: CellDataOrders[]) => {
        return row && row.length ?
            row.map((c, index: number) =>
                <React.Fragment key={index}>{c}</React.Fragment>
        ) : (
                <NoResultData class="themes" title={formatMessage({ id: 'page.body.trade.header.openOrders.nodata' })}/>
            );
    }, [formatMessage]);

    const renderBody = React.useCallback((rows: CellDataOrders[][], rowKeyIndexValue: number | undefined) => {

        const dataToBeMapped = data || rows;
        const rowElements = dataToBeMapped.map((r, i) => {
            const rowKey = String((rowKeyIndexValue !== undefined) ? r[rowKeyIndexValue] : i);

            return (
                <div
                    className="trade-orders__table__body__row"
                    key={rowKey}
                    onClick={handleSelect(rowKey)}
                >
                    {renderRowCells(r)}
                </div>
            );
        });

        return (
            <React.Fragment>
                {rowElements}
            </React.Fragment>
        );
    }, [handleSelect, renderRowCells, data, selectedRowKey]);


    React.useEffect(() => {
        setSelectedRowKey(props.selectedKey);
    }, [props.selectedKey]);


    return (
        <React.Fragment>
            {header && header.length && renderHead(header)}
            <div className="trade-orders__table__body">{renderBody(data, rowKeyIndex)} </div>
        </React.Fragment>
    );
};
