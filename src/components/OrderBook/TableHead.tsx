import * as React from 'react';

export type FlexData = string | number | React.ReactNode | undefined;

export interface TableHeadProps {
    header?: React.ReactNode[];
}

export const TableHead: React.FC<TableHeadProps> = (props: TableHeadProps) => {
    const {
        header,
    } = props;

    const renderHead = React.useCallback((row: FlexData[]) => {
        const cells = row.map((c, index) => c ?  <div className='cells' key={index}>{c}</div> : 
            <div className='cells' key={index}>&nbsp;</div>);
        return (
            <div className='table-datas__head'>
                {cells}
            </div>
        );
    }, []);

    return header && header.length && renderHead(header);
};
