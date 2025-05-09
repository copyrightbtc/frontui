import * as React from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router';
import { ArrowBackIcon } from 'src/assets/images/ArrowBackIcon';

const WalletsButtonsComponent = props => {
    const intl = useIntl();
    const history = useHistory();

    return (
        <div className="mobile-wallets-buttons">
            <button
                className="mobile-wallets-buttons__button deposit"
                onClick={() => history.push(`/wallets/${props.currency}/deposit`)}
            >
                {intl.formatMessage({ id: 'page.body.wallets.tabs.deposit' })}
                <ArrowBackIcon />
            </button>
            <button
                className="mobile-wallets-buttons__button withdraw"
                onClick={() => history.push(`/wallets/${props.currency}/withdraw`)}
            >
                <ArrowBackIcon />
                {intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw' })}
            </button>
        </div>
    );
};

const WalletsButtons = React.memo(WalletsButtonsComponent);

export {
    WalletsButtons,
};

