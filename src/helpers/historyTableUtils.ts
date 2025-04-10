export const depositColorMapping = {
    accepted: 'var(--success)',
    collected: 'var(--success)',
    submitted: 'var(--accent)',
    canceled: 'var(--danger)',
    rejected: 'var(--danger)',
    fee: 'var(--pending)',
    fee_processing: 'var(--pending)',
    errored: 'var(--danger)',
    processing: 'var(--pending)',
};

export const withdrawColorMapping = {
    prepared: 'var(--pending)',
    submitted: 'var(--accent)',
    canceled: 'var(--danger)',
    accepted: 'var(--success)',
    suspected: 'var(--pending)',
    rejected: 'var(--danger)',
    processing: 'var(--pending)',
    succeed: 'var(--success)',
    failed: 'var(--danger)',
    errored: 'var(--danger)',
    confirming: 'var(--pending)',
    under_review: 'var(--pending)',
};

export const offersColorMapping = {
    wait: 'var(--pending)',
    cancelled: 'var(--danger)',
    done: 'var(--success)',
};

export const tradesColorMapping = {
    sell: {
        color: 'var(--danger)',
        text: 'Sell',
    },
    buy: {
        color: 'var(--success)',
        text: 'Buy',
    },
};

export const transferColorMapping = {
    completed: 'var(--success)',
    done: 'var(--success)',
};

export const stateColorMapping = {
    dispute: {
        color: 'var(--pending)',
        text: 'Dispute',
    },
    done: {
        color: 'var(--danger)',
        text: 'Completed',
    },
    cancelled: {
        color: 'var(--success)',
        text: 'Cancelled',
    },
    autocancelled: {
        color: 'var(--success)',
        text: 'Auto Cancelled',
    },
    wait: {
        color: 'var(--pending)',
        text: 'Wait',
    },
    prepared: {
        color: 'var(--pending)',
        text: 'Prepared',
    },
}

export const setDepositStatusColor = (status: string): string => depositColorMapping[status];

export const setWithdrawStatusColor = (status: string): string => withdrawColorMapping[status];

export const setTradesType = (type: string) => tradesColorMapping[type] || { color: '', text: '' };

export const setTransferStatusColor = (status: string): string => transferColorMapping[status];

export const setOfferStatusColor = (status: string): string => offersColorMapping[status];

export const setStateType = (status: string) => stateColorMapping[status] || {color: '', text: ''};
