export const formatNumber = (value: number | string) => {
    let _value = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return _value;
}