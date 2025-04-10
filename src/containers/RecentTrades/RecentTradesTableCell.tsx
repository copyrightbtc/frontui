import * as React from 'react';
import { Decimal } from '../../components/Decimal';
import { setTradeColor } from '../../helpers';

const TradeTableCellComponent = props => {
    const { type, takerType, higlightedDate, amountFixed, amount, priceFixed, price, prevValue, id } = props;

    switch (type) {
        case 'price':
            return <div style={{ color: setTradeColor(takerType).color }}><Decimal fixed={priceFixed} thousSep="," prevValue={prevValue} key={id}>{price}</Decimal></div>;
        case 'amount':
            return <div key={id}>{Decimal.format(amount, amountFixed, ',')}</div>;
        case 'date':
            return <div key={id}>{higlightedDate}</div>;
        default:
            return <div />;
    }
};

const TradeTableCell = React.memo(TradeTableCellComponent);

export {
    TradeTableCell,
};
