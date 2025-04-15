import classNames from 'classnames';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { NoResultData } from 'src/components';

export type CellData = string | number | React.ReactNode | undefined;

export interface Filter {
    name: string;
    filter: (cell: CellData[]) => boolean;
}

export interface TableState {
    activeFilter?: string;
    resultData?: CellData[][];
    selectedRowKey?: string;
}

export interface TableProps {
    data: CellData[][];
    header?: React.ReactNode[];
    filters?: Filter[];
    rowKeyIndex?: number;
    selectedKey?: string;
    onSelect?: (key: string) => void;
    titleComponent?: React.ReactNode;
    rowBackground?: (row: number) => React.CSSProperties;
    side?: 'left' | 'right';
    rowBackgroundColor?: string;
    colSpan?: number;
    themes?: boolean;
    withhover?: boolean;
}

/**
 * Sfortrade Table overrides default table
 */
export const Table: React.FC<TableProps> = (props: TableProps) => {
    const { formatMessage } = useIntl();
    const [activeFilter, setActiveFilter] = React.useState<TableState['activeFilter']>(undefined);
    const [resultData, setResultData] = React.useState<TableState['resultData']>(undefined);
    const [selectedRowKey, setSelectedRowKey] = React.useState<TableState['selectedRowKey']>(props.selectedKey);

    const {
        data,
        header,
        titleComponent,
        filters = [],
        rowKeyIndex,
        onSelect,
        rowBackground,
        side,
        themes,
        withhover,
        rowBackgroundColor = 'rgba(184, 233, 245, 0.7)',
    } = props;

    const renderRowCells = React.useCallback((row: CellData[]) => {
        return row && row.length ?
            row.map((c, index: number) =>
                <td key={index} colSpan={row.length === 1 ? props.colSpan : undefined}>{c}</td>
        ) :(
            <div className="table-noresult">
                <NoResultData class="themes" title={formatMessage({ id: 'page.noDataToShow' })} />
            </div>
        );
    }, [header, props.colSpan, formatMessage]);

    const handleFilter = React.useCallback((item: Filter) => {
        if (!item.filter) {
            setResultData(props.data);

            return;
        }
        setActiveFilter(item.name);
        setResultData([...data].filter(item.filter));
    }, [data, props.data]);

    const handleSelect = React.useCallback((key: string) => () => {
        if (onSelect) {
            setSelectedRowKey(key);

            if (onSelect) {
                onSelect(key);
            }
        }
    }, [onSelect]);

    const renderFilters = React.useCallback(() => {
        const getClassName = (filterName: string) => classNames('table-main__filter', {
            'table-main__filter--active': activeFilter === filterName,
        });

        return filters.map((item: Filter) => (
            <div
                className={getClassName(item.name)}
                key={item.name}
                onClick={() => handleFilter(item)}
            >
                {item.name}
            </div>
        ));
    }, [activeFilter, filters, handleFilter]);

    const renderHead = React.useCallback((row: CellData[]) => {
        const cells = row.map((c, index) => c ?  <th key={index}>{c}</th> : <th key={index}>&nbsp;</th>);
        return (
            <thead>
                <tr>{cells}</tr>
            </thead>
        );
    }, []);

    const renderRowBackground = React.useCallback((i: number) => {
        const rowBackgroundResult = rowBackground ? rowBackground(i) : {};
        const style = {
            ...rowBackgroundResult,
            backgroundColor: rowBackgroundColor,
        };

        return (rowBackground
            ? <div key={i} style={style} className="table-main-background__row" />
            : null);
    }, [rowBackground, rowBackgroundColor]);

    const renderBackground = React.useCallback((rows: CellData[][]) => {
        const dataToBeMapped = resultData || rows;
        const renderBackgroundRow = (r: CellData[], i: number) => renderRowBackground(i);

        const className = classNames('table-main__background', {
            'table-main__background--left': side === 'left',
            'table-main__background--right': side === 'right',
        });

        return (
            <div className={className}>
                {rowBackground && dataToBeMapped.map(renderBackgroundRow)}
            </div>
        );
    }, [resultData, side, renderRowBackground, rowBackground]);

    const renderBody = React.useCallback((rows: CellData[][], rowKeyIndexValue: number | undefined) => {
        const rowClassName = (key: string) => classNames({
            'selected': selectedRowKey === key,
        });

        const dataToBeMapped = resultData || rows;
        const rowElements = dataToBeMapped.map((r, i) => {
            const rowKey = String((rowKeyIndexValue !== undefined) ? r[rowKeyIndexValue] : i);

            return (
                <tr
                    className={rowClassName(rowKey)}
                    key={rowKey}
                    onClick={handleSelect(rowKey)}
                >
                    {renderRowCells(r)}
                </tr>
            );
        });

        return (
            <tbody>
            {rowElements}
            </tbody>
        );
    }, [handleSelect, renderRowCells, resultData, selectedRowKey]);

    React.useEffect(() => {
        if (props.filters) {
            const newActiveFilter = props.filters.find(
                filter => filter.name === activeFilter,
            );

            if (newActiveFilter) {
                handleFilter(newActiveFilter);
            }
        }
    });

    React.useEffect(() => {
        setSelectedRowKey(props.selectedKey);
    }, [props.selectedKey]);

    const cn = React.useMemo(() => classNames('table-main-content', {
        'table-main-content__empty': !titleComponent && filters.length === 0,
    }), [titleComponent, filters.length]);

    return (
        <React.Fragment>
            <div className={cn}>
                {titleComponent ? <div className={'table-main__title'}>{props.titleComponent}</div> : null}
                {filters.length
                    ?
                    <div className="table-main__filters">{renderFilters()}</div>
                    : null}
            </div>
            <table 
                className={classNames('table-main', {
                    'themes': themes,
                    'with-hover': withhover,
                })}>
                {header && header.length && renderHead(header)}
                {renderBody(data, rowKeyIndex)}
            </table>
            {renderBackground(data)}
        </React.Fragment>
    );
};
