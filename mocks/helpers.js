const getRandomArbitrary = (min, max, precision) => {
    const randomValue = Math.random() * (max - min) + min;

    return precision ? randomValue.toFixed(precision) : randomValue;
}

const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1)) + min;
}


const Helpers = {
    getMarketInfos: (marketName) => {
        let pairs = marketName.split("/");
        let baseUnit = pairs[0].toLowerCase();
        let quoteUnit = pairs[1].toLowerCase();
        let marketId = `${baseUnit}${quoteUnit}`;

        return {
            baseUnit,
            quoteUnit,
            marketId,
        }
    },
    getTickers: (markets) => {
        let tickers = {}
        markets.forEach(name => {
            let { marketId } = Helpers.getMarketInfos(name);
            const change = (10 + Math.random() * 10) * (Math.random() > 0.5 ? 1 : -1);
            const coeffChange = 1 + parseFloat(change / 1000);
            const open = 0.134 * coeffChange;
            const last = 0.134 / coeffChange;
            const price_change_percent = (last - open) / last * 100;
            const signPrefix = price_change_percent >= 0 ? '+' : '-';

            tickers[marketId] = {
                "amount": `${15 * coeffChange}`,
                "low": `${0.001 * coeffChange}`,
                "high": `${0.145 * coeffChange}`,
                "last": `${last}`,
                "open": open,
                "volume": `${3500 * coeffChange}`,
                "avg_price": "0.0",
                "price_change_percent": `${signPrefix}${Math.abs(price_change_percent.toFixed(2))}%`,
                "at": Date.now() / 1000,
            }
        });

        return tickers;
    },
    getBalances: () => {
        const getBalanceValue = (value, precision) => ((Math.random() > 0.5 ? 1 : -1) * Math.random() / 10 + +value).toFixed(precision);
        const getLockedValue = (value, precision) => (Math.random() / 10 + +value).toFixed(precision);

        return {
            "bch":  [getBalanceValue("10.12", 8), getLockedValue("0.001", 8), 'spot'],
            "btc": [getBalanceValue("0.21026373", 8), getLockedValue("0.1101", 8), 'spot'],
            "dash": [getBalanceValue("5.1051", 6), getLockedValue("1.1205", 6), 'spot'],
            "eth": [getBalanceValue("5", 6), getLockedValue("0.0002", 6), 'spot'],
            "usd":  [getBalanceValue("1000", 2), getLockedValue("100", 2), 'p2p']
        }
    },
    getDepth: (sequence) => {
        const delta = 2 * (1 + Math.cos(2 * Math.PI * Date.now() / 1000 / 3600))
        const fV = (volume) => String(parseFloat(volume) + delta * 10);

        return {
            "asks": [
                ["15.0", fV("1.5")],
                ["20.0", fV("80")],
                ["20.5", fV("10.0")],
                ["30.0", fV("1.0")]
            ],
            "bids": [
                ["10.95", fV("1.5")],
                ["10.90", fV("45")],
                ["10.85", fV("35")],
                ["10.70", fV("10")],
            ],
            "sequence": sequence,
        }
    },
    getDepthIncrement: (sequence) => {
        const delta = getRandomArbitrary(1, 100, 2) * (1 + Math.cos(2 * Math.PI * Date.now() / 1000 / 3600))
        const fV = (volume) => String(parseFloat(volume) + delta);
        const countOfAsks = getRandomInt(1, 5);
        const countOfBids = getRandomInt(1, 5);
        const sideProbability = Math.random();
        const asks = [];
        const bids = [];
        
        for (var i = 0; i < countOfAsks; i++) {
            asks.push([getRandomArbitrary(15, 20, 1), fV("1.5")]);
        }
    
        for (var i = 0; i < countOfBids; i++) {
            bids.push([getRandomArbitrary(10, 12, 2), fV("1.5")]);
        }

        if (sideProbability < 0.25) {
            return {
                "asks": asks,
                "sequence": sequence,
            }
        }

        if (sideProbability < 0.5) {
            return {
                "bids": bids,
                "sequence": sequence,
            }
        }

        return {
            "bids": asks,
            "asks": bids,
            "sequence": sequence,
        }
    },
    getP2PMessage: () => {
        return {
            "uid": "ID787E383938",
            "user_name": "test",
            "body": "test",
            "created_at": "123",
        }
    },
    getP2PTrade: () => {
        const array = [1718728682821791232, 1];
        const states = ['done', 'wait', 'pending', 'cancelled', 'dispute'];
        return {
            "maker": {
                "uid": "ID64C0917431",
                "username": null
            },
            "tid": array[Math.floor(Math.random() * array.length)],
            "taker": {
                "uid": "ID787E383938",
                "username": null
            },
            "price": "25000.0",
            "amount": "3.0",
            "maker_accepted": true,
            "taker_accepted": false,
            "maker_seen": true,
            "taker_seen": true,
            "paytime": 15,
            "state": states[Math.floor(Math.random() * states.length)],
            "side": "sell",
            "created_at": "2024-06-24T22:32:32.000",
            "updated_at": "2024-06-24T22:32:32.000",
            "completed_at": "2024-06-18T09:17:00",
            "coin_currency": "usdt",
            "fiat_currency": "vnd",
            "payment": {
                "id": 26,
                "member_id": 24,
                "payment_type": "bank",
                "state": "active",
                "account_name": "NGUYEN HUU HA",
                "data": {
                "bank_name": "Vietcombank",
                "bank_branch": "Hanoi",
                "bank_account": "123456789"
                },
                "created_at": "2024-06-24T09:30:32.000",
                "updated_at": "2024-06-24T09:30:32.000"
            }
        }
    },
    getP2POrder: (state) => {
        const array = [1718728682821791232, 1];
        const states = ['done', 'wait', 'pending', 'cancelled', 'dispute'];

        return {
            "event": `p2p_order.${state}`,
            "payload": {
                "tid": array[Math.floor(Math.random() * array.length)],
                "user_uid":"ID787E383938",
                "base":"usdt",
                "quote":"usd",
                "side":"sell",
                "price":"1",
                "origin_amount":"6",
                "available_amount":"6",
                "min_order_amount":"10",
                "max_order_amount":"100",
                "time_limit":10,
                "state": states[Math.floor(Math.random() * states.length)],
                "payment_methods":null,
                "offer": {
                    "id": 8,
                    "uid": "IDD9046D42A4",
                    "base": "ngnt",
                    "quote": "ngn",
                    "side": "buy",
                    "price": "123",
                    "origin_amount": "12",
                    "available_amount": "12",
                    "min_order_amount": "1",
                    "max_order_amount": "2",
                    "time_limit": 900,
                    "state": "wait",
                    "description": "asd",
                    "reply": "",
                    "payment_methods": [
                        {
                            "id": 24,
                            "user_uid": "IDD9046D42A4",
                            "payment_method_id": 6,
                            "data": {
                                "card_number": "1312123123123123"
                            },
                            "created_at": "2024-04-16T14:12:46.547Z",
                            "updated_at": "2024-04-16T14:12:46.547Z",
                            "payment_method": {
                                "id": 6,
                                "type": "Bank Transfer",
                                "name": "Mono transfer",
                                "options": {
                                    "card_number": {
                                        "name": "Card Number",
                                        "type": "short_answer",
                                        "required": true,
                                        "description": "Your card number"
                                    }
                                },
                                "enabled": true,
                                "created_at": "2024-04-16T10:49:57.13Z",
                                "updated_at": "2024-04-16T10:49:57.13Z"
                            }
                        },
                         {
                            "id": 25,
                            "user_uid": "IDD9046D42A4",
                            "payment_method_id": 7,
                            "data": {
                                "card_number": "1312123123123123",
                                "account_name": "Boss"
                            },
                            "created_at": "2024-04-16T14:12:46.547Z",
                            "updated_at": "2024-04-16T14:12:46.547Z",
                            "payment_method": {
                                "id": 6,
                                "type": "Bank Transfer",
                                "name": "PrivatBank",
                                "options": {
                                    "card_number": {
                                        "name": "Card Number",
                                        "type": "short_answer",
                                        "required": true,
                                        "description": "Your card number"
                                    }
                                },
                                "enabled": true,
                                "created_at": "2024-04-16T10:49:57.13Z",
                                "updated_at": "2024-04-16T10:49:57.13Z"
                            }
                        }
                    ],
                    "user": {
                        "user_uid": "IDD9046D42A4",
                        "user_user": "email",
                        "user_nickname": "kek",
                        "offers_count": 1
                    },
                    "created_at": "2024-04-16T14:42:10.167Z",
                    "updated_at": "2024-04-16T14:42:10.167Z"
                }
            }
        }
    },
    getP2POffer: (state) => {
        const states = ['done', 'wait', 'cancelled'];
        const ids = [1, 2, 8, 10];

        return {
            "event": `p2p_offer.${state}`,
            "payload": {
                "id": ids[Math.floor(Math.random() * ids.length)],
                "uid": "IDD9046D42A4",
                "base": "usdt",
                "quote": "ngn",
                "side": "buy",
                "price": "27",
                "origin_amount": "12",
                "available_amount": "10",
                "min_order_amount": "1",
                "max_order_amount": "2",
                "time_limit": 900,
                "state": states[Math.floor(Math.random() * states.length)],
                "description": "asd",
                "reply": "",
                "payment_methods": [
                    {
                        "id": 24,
                        "user_uid": "IDD9046D42A4",
                        "payment_method_id": 6,
                        "data": {
                            "card_number": "1312123123123123"
                        },
                        "created_at": "2024-04-16T14:12:46.547Z",
                        "updated_at": "2024-04-16T14:12:46.547Z",
                        "payment_method": {
                            "id": 6,
                            "type": "Bank Transfer",
                            "name": "Mono transfer",
                            "options": {
                                "card_number": {
                                    "name": "Card Number",
                                    "type": "short_answer",
                                    "required": true,
                                    "description": "Your card number"
                                }
                            },
                            "enabled": true,
                            "created_at": "2024-04-16T10:49:57.13Z",
                            "updated_at": "2024-04-16T10:49:57.13Z"
                        }
                    }
                ],
                "user": {
                    "user_uid": "IDD9046D42A4",
                    "user_user": "maker@sfortrade.com",
                    "user_nickname": "maker",
                    "offers_count": 4
                },
                "created_at": "2024-04-16T14:42:10.167Z",
                "updated_at": "2024-04-20T08:01:52.539Z"
            }
        }
    },
    getP2PAdvertisements: () => {
        return {
            "id": 2,
            "coin_currency": "btc",
            "fiat_currency": "vnd",
            "price":`${Math.round(((Math.random() + 1) * 15000 + Number.EPSILON) * 100) / 100}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
            "amount": "0.05",
            "min_amount": "1000000.0",
            "max_amount": "5000000.0",
            "lock_trade_amount": "0.0",
            "state": "active",
            "side": "buy",
            "paytime": 30,
            "description": "Mua BTC với giá tốt",
            "created_at": "2024-06-25T14:23:22+07:00",
            "updated_at": "2024-06-25T14:23:22+07:00"
        }
    },
    getStreamsFromUrl: (url) => url.replace("/", "").split(/[&?]stream=/).filter(stream => stream.length > 0 && stream !== 'api/v2/ranger/public/' && stream !== 'api/v2/ranger/private' && stream !== 'api/v2/ranger/private/'),
    unique: (list) => list.filter((value, index, self) => self.indexOf(value) === index)
}

module.exports = Helpers;
