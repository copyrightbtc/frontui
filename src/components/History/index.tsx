import classnames from 'classnames';
import * as React from 'react';
import { CellData, Table } from '../Table';

export interface HistoryProps {
    data: CellData[][];
    headers?: (string | JSX.Element)[];
    onSelect?: (key: string) => void;
}

export class History extends React.PureComponent<HistoryProps> {
    private defaultHeaders = ['Time', 'Action', 'Price', 'Amount', 'Total'];
    private title = 'Trades History';

    public render() {
        const { headers = this.defaultHeaders, onSelect } = this.props;
        const tableData = this.props.data.map(row => row.map(this.mapRows));

        return (
            <Table
                data={tableData}
                header={headers}
                titleComponent={this.title}
                onSelect={onSelect}
            />
        );
    }

    public renderAction(actionType: string) {
        const action = actionType ? actionType.toLowerCase() : actionType;
        const className = classnames('history-action', {
            'history-action--buy': action === 'bid',
            'history-action--sell': action === 'ask',
        });

        return <span className={className}>{action}</span>;
    }

    private mapRows = (cell: CellData, index: number) => {
        const { headers = this.defaultHeaders } = this.props;
        const actionIndex = headers.findIndex(header => header === 'Action');

        return index === actionIndex ? this.renderAction(cell as string) : cell;
    };
}
