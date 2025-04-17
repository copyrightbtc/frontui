export const accumulateVolume = array => {
    const total: number[] = [];
    array.map(item => {
        return item[1];
    }).reduce((accumulator, currentValue, currentIndex) => {
        //total[currentIndex] = Number(accumulator) * Number(currentValue);
        //return (Number(accumulator) + Number(currentValue));
        total[currentIndex] = Number(currentValue);
        return Number(currentValue);
    }, 0);

    return total;
};
