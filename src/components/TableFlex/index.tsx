import classNames from 'classnames';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { NoResultData } from 'src/components';

export type FlexData = string | number | React.ReactNode | undefined;

export interface FilterFlex {
    name: string;
    filter: (cell: FlexData[]) => boolean;
}

export interface TableFlexState {
    activeFilter?: string;
    selectedRowKey?: string;
}

export interface TableFlexProps {
    data: FlexData[][];
    header?: React.ReactNode[];
    rowKeyIndex?: number;
    selectedKey?: string;
    onSelect?: (key: string) => void;
    titleComponent?: React.ReactNode;
    rowBackground?: (row: number) => React.CSSProperties;
    rowBackgroundColor?: string;
    themes?: boolean;
    withhover?: boolean;
}

export const TableFlex: React.FC<TableFlexProps> = (props: TableFlexProps) => {
    const { formatMessage } = useIntl();
    const [selectedRowKey, setSelectedRowKey] = React.useState<TableFlexState['selectedRowKey']>(props.selectedKey);

    const {
        data,
        header,
        titleComponent,
        rowKeyIndex,
        onSelect,
        themes,
        withhover,
    } = props;

    const renderRowCells = React.useCallback((cell: FlexData[]) => {
        return cell && cell.length ?
        cell.map((c, index: number) =>
                <div className='flexes-tables__body__row__cell' key={index}>{c}</div>
        ) :( 
            <NoResultData class="themes" title={formatMessage({ id: 'page.noDataToShow' })} />
        );
    }, [header, formatMessage]);

    const handleSelect = React.useCallback((key: string) => () => {
        if (onSelect) {
            setSelectedRowKey(key);

            if (onSelect) {
                onSelect(key);
            }
        }
    }, [onSelect]);

    const renderHead = React.useCallback((cell: FlexData[]) => {
        const cells = cell.map((c, index) => c ?  <div className='flexes-tables__head__cell' key={index}>{c}</div> : 
            <div className='flexes-tables__head__cell' key={index}>&nbsp;</div>);
        return (
            <div className='flexes-tables__head'>
                {cells}
            </div>
        );
    }, []);

    const renderBody = React.useCallback((rows: FlexData[][], rowKeyIndexValue: number | undefined) => {
        const rowClassName = (key: string) => classNames('flexes-tables__body__row', {
            'selected': selectedRowKey === key,
            'empty-row': rowKeyIndexValue === undefined
        });

        const rowElements = rows.map((r, i) => {
            const rowKey = String((rowKeyIndexValue !== undefined) ? r[rowKeyIndexValue] : i);
            const rowKeyEmpty = r[rowKeyIndexValue] === undefined;

            return (
                <div
                    className={!rowKeyEmpty ? rowClassName(rowKey) : 'flexes-tables__body__row empty-row'}
                    key={rowKey}
                    onClick={handleSelect(rowKey)}
                >
                    {renderRowCells(r)}
                </div>
            )
        });

        return (
            <div className='flexes-tables__body'>
                {rowElements}
            </div>
        );
    }, [handleSelect, renderRowCells, selectedRowKey]);

    React.useEffect(() => {
        setSelectedRowKey(props.selectedKey);
    }, [props.selectedKey]);


    return (
        <React.Fragment>
                {titleComponent ? <div className={'flexes-tables__title'}>{props.titleComponent}</div> : null}
            <div 
                className={classNames('flexes-tables', {
                    'themes': themes,
                    'with-hover': withhover,
                })}>
                {header && header.length && renderHead(header)}
                {renderBody(data, rowKeyIndex)}
            </div>
        </React.Fragment>
    );
};
