const tradesColorMapping = {
    buy: {
        color: 'var(--color-buy)',
    },
    sell: {
        color: 'var(--color-sell)',
    },
};

export const setTradeColor = (side: string) => tradesColorMapping[side] || { color: ''};
