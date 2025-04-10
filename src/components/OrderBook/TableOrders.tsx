import * as React from 'react';
import { useIntl } from 'react-intl';
import { NoResultData } from 'src/components';

export type OrdersData = string | number | React.ReactNode | undefined;

export interface TableOrdersState {
    selectedRowKey?: string;
}

export interface TableOrdersProps {
    data: OrdersData[][];
    header?: React.ReactNode[];
    rowKeyIndex?: number;
    selectedKey?: string;
    onSelect?: (key: string) => void;
    rowBackground?: (row: number) => React.CSSProperties;
    rowBackgroundColor?: string;
}

export const TableOrders: React.FC<TableOrdersProps> = (props: TableOrdersProps) => {
    const { formatMessage } = useIntl();
    const [selectedRowKey, setSelectedRowKey] = React.useState<TableOrdersState['selectedRowKey']>(props.selectedKey);

    const {
        data,
        header,
        rowKeyIndex,
        onSelect,
        rowBackground,
        rowBackgroundColor = 'rgba(184, 233, 245, 0.7)',
    } = props;

    const handleSelect = React.useCallback((key: string) => () => {
        if (onSelect) {
            setSelectedRowKey(key);

            if (onSelect) {
                onSelect(key);
            }
        }
    }, [onSelect]);

    const renderHead = React.useCallback((row: OrdersData[]) => {
        const cells = row.map((c, index) => c ?  <div className='cells' key={index}>{c}</div> : 
            <div className='cells' key={index}>&nbsp;</div>);
        return (
            <div className='table-datas__head'>
                {cells}
            </div>
        );
    }, []);

    const renderRowCells = React.useCallback((row: OrdersData[]) => {
        return row && row.length ?
            row.map((c, index: number) =>
                <div className='cells' key={index}>{c}</div>
        ) : (
            <NoResultData class="themes" title={formatMessage({ id: 'page.noDataToShow' })} />
        );
    }, [header, formatMessage]);
    
    const renderRowBackground = React.useCallback((i: number) => {
        const rowBackgroundResult = rowBackground ? rowBackground(i) : {};
        const style = {
            ...rowBackgroundResult,
            backgroundColor: rowBackgroundColor,
        };

        return (rowBackground
            ? <div key={i} style={style} className="backgrounds" />
            : null);
            
    }, [rowBackground, rowBackgroundColor]);

    const renderBody = React.useCallback((rows: OrdersData[][], rowKeyIndexValue: number | undefined) => {

        const dataToBeMapped = data || rows;
        const rowElements = dataToBeMapped.map((r, i) => {
            const rowKey = String((rowKeyIndexValue !== undefined) ? r[rowKeyIndexValue] : i);

            return (
                <div
                    className="table-datas__body__row"
                    key={rowKey}
                    onClick={handleSelect(rowKey)}
                >
                    {renderRowCells(r)}
                    {renderRowBackground(i)}
                </div>
            );
        });

        return (
            <div className='table-datas__body'>
                {rowElements}
            </div>
        );
    }, [handleSelect, renderRowCells, data, selectedRowKey]);
    
    React.useEffect(() => {
        setSelectedRowKey(props.selectedKey);
    }, [props.selectedKey]);


    return (
        <React.Fragment>
            <div className="table-datas">
                {header && header.length && renderHead(header)}
                {renderBody(data, rowKeyIndex)}
            </div>
        </React.Fragment>
    );
};
