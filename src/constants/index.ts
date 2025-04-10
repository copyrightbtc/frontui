import { Wallet } from "src/modules";
import { RowOrderElement } from "../components/Order";

export const PG_TITLE_PREFIX = "SforTrade";

export const DEFAULT_WALLET: Wallet = {
    name: "",
    currency: "",
    balance: "",
    type: "coin",
    fixed: 0,
    networks: [{ blockchain_key: "", fee: 0, protocol: "" }],
    account_type: "",
};

export const DEFAULT_CCY_PRECISION = 4;
export const DEFAULT_FIAT_PRECISION = 2;
export const DEFAULT_TRADING_VIEW_INTERVAL = "15";
export const VALUATION_PRIMARY_CURRENCY = "USDT";
export const VALUATION_SECONDARY_CURRENCY = "BTC";

export const PASSWORD_ENTROPY_STEP = 6;

export const DEFAULT_KYC_STEPS = ["email", "phone", "profile", "document", "address"];

export const DEFAULT_MARKET_HEADERS = ["Pair", "Price", "24h Change"];

export const TRANSFER_TYPES_LIST = ["Spot", "P2P"];

export const DEFAULT_ORDER_TYPES: RowOrderElement[] = ["Limit", "Market"];
export const AMOUNT_PERCENTAGE_ARRAY = [0, 0.25, 0.5, 0.75, 1];
export const SET_MAXIMUM_AMOUNT_ARRAY = [1];
export const DEFAULT_TABLE_PAGE_LIMIT = 25;
export const HOST_URL = window.location.hostname === "localhost" ? "http://localhost:9002" : window.location.origin;

export const ORDER_TYPES_WITH_TRIGGER = ["Stop-loss", "Take-profit", "Stop-limit", "Take-limit"];

export const TRIGGER_BUY_PRICE_MULT = 1.1;
export const TRIGGER_BUY_PRICE_ADJUSTED_TYPES = ["stop-loss", "take-profit"];

export const DEFAULT_MARKET = {
    id: "",
    name: "",
    base_unit: "",
    quote_unit: "",
    min_price: "",
    max_price: 0,
    min_amount: 0,
    amount_precision: 0,
    price_precision: 0,
};

export const colors = {
    light: {
        chart: {
            primary: "var(--rgb-background)",
            lines: "#65666d99",
            white: "#ccc5c5",
            up: "var(--rgb-bids)",
            down: "var(--rgb-asks)",
        },
        navbar: {
            sun: "var(--color-dark)",
            moon: "var(--icons)",
        },
        orderBook: {
            asks: "var(--color-sell)",
            bids: "var(--color-buy)",
        },
        depth: {
            fillAreaAsk: "#fa5252",
            fillAreaBid: "#12b886",
            gridBackgroundStart: "#1a243b",
            gridBackgroundEnd: "#1a243b",
            strokeAreaAsk: "#fa5252",
            strokeAreaBid: "#12b886",
            strokeGrid: "#B8E9F5",
            strokeAxis: "#000",
        },
    },
    dark: {
        chart: {
            primary: "var(--rgb-background)",
            lines: "#65666d99",
            white: "#ccc5c5",
            up: "var(--rgb-bids)",
            down: "var(--rgb-asks)",
        },
        navbar: {
            sun: "var(--color-dark)",
            moon: "var(--icons)",
        },
        orderBook: {
            asks: "var(--color-sell)",
            bids: "var(--color-buy)",
        },
        depth: {
            fillAreaAsk: "var(--rgb-asks)",
            fillAreaBid: "var(--rgb-bids)",
            gridBackgroundStart: "var(--rgb-asks)",
            gridBackgroundEnd: "var(--rgb-asks)",
            strokeAreaAsk: "var(--rgb-asks)",
            strokeAreaBid: "var(--rgb-bids)",
            strokeGrid: "#65666d99",
            strokeAxis: "#65666d99",
        },
    },
};

export const FIXED_VOL_PRECISION = 2;
export const DEFAULT_PERCENTAGE_PRECISION = 2;
export const CURRENCIES_DT = ['xrp'];
export const CURRENCIES_MEMO = ['xlm', 'eos', 'luna', 'xem', 'hbar'];
export const DELAY_AFTER_VERIFICATION_REQUEST = 60;
