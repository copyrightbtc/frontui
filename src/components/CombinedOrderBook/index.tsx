import * as React from 'react';
import { OrderBook } from '../';
import { OrdersData } from '../OrderBook/TableOrders';
import { TableHead } from '../OrderBook/TableHead';
import { NoResultData } from 'src/components';
import { FormattedMessage } from 'react-intl';
import { OrderBookTabs } from './OrderBookTabs';
import { AllbookIcon } from '../../assets/images/customization/AllbookIcon';
import { AskbookIcon } from '../../assets/images/customization/AskbookIcon';
import { BidsbookIcon } from '../../assets/images/customization/BidsbookIcon';

export interface CombinedOrderBookProps {
  dataAsks: OrdersData[][];
  dataBids: OrdersData[][];
  maxVolume?: number;
  orderBookEntryAsks: number[];
  orderBookEntryBids: number[];
  headers: string[];
  bestAsk?: string;
  bestBid?: string;
  rowBackgroundColorAsks?: string;
  rowBackgroundColorBids?: string;
  onSelectAsks: (orderIndex: string) => void;
  onSelectBids: (orderIndex: string) => void;
  isLarge: boolean;
  lastPrice: React.ReactNode;
  noDataAsks?: boolean;
  noDataBids?: boolean;
  noDataMessage?: string;
  sliderCompare?: React.ReactNode;
}

interface State { 
    currentTabIndex: number;
  }

export class CombinedOrderBook extends React.PureComponent<CombinedOrderBookProps, State> {

    public state = {
        currentTabIndex: 0, 
    };

    public componentDidMount() {
        const scroll = document.getElementsByClassName('order-book-block')[0];

        if (!this.props.isLarge && scroll) {
          scroll.scrollTop = scroll.scrollHeight;
        }
    }

    public componentWillReceiveProps(next: CombinedOrderBookProps) {
        const scroll = document.getElementsByClassName('order-book-block')[0];

        if (next.isLarge !== this.props.isLarge && !next.isLarge && scroll) {
            scroll.scrollTop = scroll.scrollHeight;
        }
    }
    private onCurrentTabChange = index => this.setState({ currentTabIndex: index });

    public render() {
        return (
            <React.Fragment>
                {this.props.isLarge ? this.orderBookLarge() : this.orderBookSmall()}
            </React.Fragment>
        );
    }
    private orderBookSmall = () => {   
        return (
            <React.Fragment> 
                <OrderBookTabs
                    panels={this.renderTabs()}
                    currentTabIndex={this.state.currentTabIndex}
                    onCurrentTabChange={this.onCurrentTabChange}
                />
            </React.Fragment>
        );
    };

    public renderNoData = (message: string) => (
        <div className="order-book-block empty">
            <TableHead
                header={this.props.headers.length && this.props.headers}
            />
            <NoResultData class="themes" title={' '}/>
            <span>{message}</span>
        </div>
    );

    public renderNoDataAsk = (message: string) => (
        <div className="order-book-block empty">
            <NoResultData class="themes" title={' '}/>
            <span>{message}</span>
        </div>
    );

    private orderBookLarge = () => {
      const {
          dataAsks,
          dataBids,
          maxVolume,
          orderBookEntryAsks,
          orderBookEntryBids,
          headers,
          rowBackgroundColorAsks,
          rowBackgroundColorBids,
          onSelectAsks,
          onSelectBids,
          lastPrice,
          noDataAsks,
          noDataBids,
          noDataMessage,
          bestAsk,
          bestBid,
      } = this.props;

      const reverseHead = headers.slice(0).reverse();
      const spreadPrice = (((Number(bestAsk || orderBookEntryAsks) - Number(bestBid || orderBookEntryBids)) / Number(bestAsk || orderBookEntryAsks)) * 100).toFixed(2);

      return (
          <React.Fragment>
              <div className="order-book-datas__large">
                  {noDataBids ? this.renderNoData(noDataMessage) :
                      <OrderBook
                            headers={reverseHead}
                            data={dataBids}
                            rowBackgroundColor={rowBackgroundColorBids}
                            maxVolume={maxVolume}
                            orderBookEntry={orderBookEntryBids}
                            onSelect={onSelectBids}
                      />
                  }
                  {noDataAsks ? this.renderNoData(noDataMessage) :
                      <OrderBook                     
                            headers={headers}
                            data={dataAsks}
                            rowBackgroundColor={rowBackgroundColorAsks}
                            maxVolume={maxVolume}
                            orderBookEntry={orderBookEntryAsks}
                            onSelect={onSelectAsks}
                      />
                  }
              </div>
              <div className="order-book-datas__market order-book-datas__large-market">
                  {lastPrice}
                  <strong>{spreadPrice == "NaN" ? '-.--' : spreadPrice} %</strong>
              </div>
          </React.Fragment>
      );
    };

    private renderTabs = () => {
      const {
          dataAsks,
          dataBids,
          maxVolume,
          orderBookEntryAsks,
          orderBookEntryBids,
          headers,
          rowBackgroundColorAsks,
          rowBackgroundColorBids,
          onSelectAsks,
          onSelectBids,
          lastPrice,
          sliderCompare,
          noDataAsks,
          noDataBids,
          noDataMessage,
          bestAsk,
          bestBid
      } = this.props;
 
      const spreadPrice = (((Number(bestAsk) - Number(bestBid)) / Number(bestAsk)) * 100).toFixed(2);

      const { currentTabIndex } = this.state;

      return [
                {
                content: currentTabIndex === 0 ? (
                <div className="order-book-datas__small">
                    {noDataAsks ? this.renderNoData(noDataMessage) :
                        <OrderBook
                            classNames="sell-block"
                            headers={headers}
                            data={dataAsks}
                            rowBackgroundColor={rowBackgroundColorAsks}
                            maxVolume={maxVolume}
                            orderBookEntry={orderBookEntryAsks}
                            onSelect={onSelectAsks}
                        />
                    }
                    <div className="order-book-datas__market">
                        {lastPrice}
                        <div className="order-book-datas__market__spread">
                            <small><FormattedMessage id="page.body.trade.orderbook.spread"/></small>
                            <strong>{spreadPrice == "NaN" ? '-.--' : spreadPrice} %</strong>
                        </div>
                    </div>
                    {noDataBids ? this.renderNoDataAsk(noDataMessage) :
                        <OrderBook
                            classNames="buy-block"
                            data={dataBids}
                            rowBackgroundColor={rowBackgroundColorBids}
                            maxVolume={maxVolume}
                            orderBookEntry={orderBookEntryBids}
                            onSelect={onSelectBids}
                        />
                    }
                    {sliderCompare}
                </div> ) : null,
                icon: <AllbookIcon />,
                },
                {
                content: currentTabIndex === 1 ? (
                <div className="order-book-datas__small">
                    <div className="order-book-datas__market">
                        {lastPrice}
                        <div className="order-book-datas__market__spread">
                            <small><FormattedMessage id="page.body.trade.orderbook.spread"/></small>
                            <strong>{spreadPrice == "NaN" ? '-.--' : spreadPrice} %</strong>
                        </div>
                    </div>
                    {noDataBids ? this.renderNoDataAsk(noDataMessage) :
                    <OrderBook
                        classNames="buy-block full"
                        data={dataBids}
                        rowBackgroundColor={rowBackgroundColorBids}
                        maxVolume={maxVolume}
                        orderBookEntry={orderBookEntryBids}
                        onSelect={onSelectBids}
                    />
                }
                {sliderCompare}
                </div> ) : null,
                icon: <AskbookIcon />,
                },
                {
                content: currentTabIndex === 2 ? (
                    <div className="order-book-datas__small">
                    {noDataAsks ? this.renderNoData(noDataMessage) :
                        <OrderBook
                            classNames="sell-block full"
                            headers={headers}
                            data={dataAsks}
                            rowBackgroundColor={rowBackgroundColorAsks}
                            maxVolume={maxVolume}
                            orderBookEntry={orderBookEntryAsks}
                            onSelect={onSelectAsks}
                        />
                    }
                    <div className="order-book-datas__market">
                        {lastPrice}
                        <div className="order-book-datas__market__spread">
                            <small><FormattedMessage id="page.body.trade.orderbook.spread"/></small>
                            <strong>{spreadPrice == "NaN" ? '-.--' : spreadPrice} %</strong>
                        </div>
                    </div>
                    {sliderCompare}
                </div> ) : null,
                icon: <BidsbookIcon />,
                },
        ];
    };
}
