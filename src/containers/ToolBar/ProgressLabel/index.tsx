import classnames from 'classnames';
import * as React from 'react';

interface Props {
    progress?: string;
    isPositive?: boolean;
    additional?: string;
    bidUnit?: string;
}

export class ProgressLabel extends React.Component<Props>{
    public render() {
        const {
            progress,
            isPositive,
            additional,
            bidUnit,
        } = this.props;
        const className = classnames({
            'progress-label__progress-positive': isPositive,
            'progress-label__progress-negative': !isPositive,
        });

        return (
            <div className="progress-label">
                <div className={className}>{progress} {bidUnit}</div>
                <div className="progress-label__additional">{additional}</div>
            </div>
        );
    }
}
