import { accumulateTotal } from './accumulateTotal';

export const calcMaxTotal = (bids: string[][], asks: string[][]) => {
    return Math.max(...accumulateTotal(bids), ...accumulateTotal(asks));
};
