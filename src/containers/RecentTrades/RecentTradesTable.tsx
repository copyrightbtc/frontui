import * as React from 'react';
import { useIntl } from 'react-intl';

export type CellDataTrades = string | number | React.ReactNode | undefined;

export interface TableState {
    selectedRowKey?: string;
}

export interface TableProps {
    data: CellDataTrades[][];
    rowKeyIndex?: number;
    selectedKey?: string;
    onSelect?: (key: string) => void;
}
 
export const RecentTradesTable: React.FC<TableProps> = (props: TableProps) => {
    const { formatMessage } = useIntl();
    const [selectedRowKey, setSelectedRowKey] = React.useState<TableState['selectedRowKey']>(props.selectedKey);

    const {
        data,
        rowKeyIndex,
        onSelect,
    } = props;

    const handleSelect = React.useCallback((key: string) => () => {
        if (onSelect) {
            setSelectedRowKey(key);

            if (onSelect) {
                onSelect(key);
            }
        }
    }, [onSelect]);

    const renderRowCells = React.useCallback((row: CellDataTrades[]) => {
        return row && row.length ?
            row.map((c, index: number) =>
                <div className='cells' key={index}>{c}</div>)
            : null;
    }, [formatMessage]);

    const renderBody = React.useCallback((rows: CellDataTrades[][], rowKeyIndexValue: number | undefined) => {

        const dataToBeMapped = data || rows;
        const rowElements = dataToBeMapped.map((r, i) => {
            const rowKey = String((rowKeyIndexValue !== undefined) ? r[rowKeyIndexValue] : i);

            return (
                <div
                    className="recent-trades__table__body__row"
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
            {renderBody(data, rowKeyIndex)} 
        </React.Fragment>
    );
};
