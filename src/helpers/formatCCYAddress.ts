import bitcore from 'bitcore-lib-cash';

export const formatCCYAddress = (currency: string, address: string): string => {
    if (address) {
        if (currency === 'BCH') {
            if (bitcore.Address.isValid(address)) {
                return bitcore.Address(address).toString(bitcore.Address._decodeCashAddress); //Address.fromString
            } else {
                return '';
            }
        } else {
            return address;
        }
    } else {
        return '';
    }
};
