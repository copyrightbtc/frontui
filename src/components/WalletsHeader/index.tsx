import * as React from 'react';
import { useIntl } from 'react-intl';
import { FilterInput } from '..';
import { Wallet } from '../../modules';
import { Checkbox } from '@mui/material';

interface ParentProps {
    wallets: Wallet[];
    nonZeroSelected: boolean;
    setFilterValue: (value: string) => void;
    setFilteredWallets: (value: Wallet[]) => void;
    handleClickCheckBox: (value: boolean) => void;
}

/**
 * Component for displaying search field and checkbox for Overview, Spot, P2P, Transfers Wallets tabs
 */
export const WalletsHeader: React.FunctionComponent<ParentProps> = (props: ParentProps) => {
    const { wallets, nonZeroSelected } = props;
    const intl = useIntl();

    const searchFilter = (row: Wallet, searchKey: string) => {
        props.setFilterValue(searchKey);
        return row ? row.name?.toLowerCase().includes(searchKey.toLowerCase()) || row.currency?.toLowerCase().includes(searchKey.toLowerCase()) : false;
    };

    const handleFilter = (result: object[]) => {
        props.setFilteredWallets(result as Wallet[]);
    };

    const handleToggleCheckbox = React.useCallback(event => {
        event.preventDefault();
        props.handleClickCheckBox(!nonZeroSelected);
    }, [nonZeroSelected, props.handleClickCheckBox]);

    return (
        <div className="overview-header__filters">
            <FilterInput
                data={wallets}
                onFilter={handleFilter}
                filter={searchFilter}
                placeholder={intl.formatMessage({id: 'page.body.wallets.overview.seach'})}
            />
            <div className="wallet-checkbox"> 
                <Checkbox 
                    checked={nonZeroSelected}
                    onClick={handleToggleCheckbox}
                    required
                    sx={{ '& .MuiSvgIcon-root': { 
                        fontSize: 22,
                        color: 'var(--accent)',
                        } 
                    }}
                />
                <p>{intl.formatMessage({id: 'page.body.wallets.overview.nonZero'})}</p>
            </div>
        </div>
    );
};
