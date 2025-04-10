import * as React from 'react';
import { useIntl } from 'react-intl';
import { FilterInput } from '..';
import { Wallet } from '../../modules';

interface ParentProps {
    wallets: Wallet[];
    setFilterValue: (value: string) => void;
    setFilteredWallets: (value: Wallet[]) => void;
    placeholder: string;
}

/**
 * Component for displaying search field and checkbox for Overview, Spot, P2P, Transfers Wallets tabs
 */
export const WalletHeaderSearch: React.FunctionComponent<ParentProps> = (props: ParentProps) => {
    const { wallets, placeholder } = props;

    const searchFilter = (row: Wallet, searchKey: string) => {
        props.setFilterValue(searchKey);
        return row ? row.name?.toLowerCase().includes(searchKey.toLowerCase()) || row.currency?.toLowerCase().includes(searchKey.toLowerCase()) : false;
    };

    const handleFilter = (result: object[]) => {
        props.setFilteredWallets(result as Wallet[]);
    };
 
    return (
        <FilterInput
            data={wallets}
            onFilter={handleFilter}
            filter={searchFilter}
            placeholder={placeholder}
        />
    );
};
