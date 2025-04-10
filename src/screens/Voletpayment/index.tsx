import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import { Button } from '@mui/material';
import NumericInput from 'react-numeric-input'; 
import {
    selectUserInfo,
} from '../../modules';

import volet from 'src/assets/images/paysystems/volet_w.svg';

const VoletpaymentComponent = props => {

    const [numbers, setNumbers] = useState(props.minAmount);
 
    const { formatMessage } = useIntl();
    const user = useSelector(selectUserInfo);
    function myFormat(num) {
        return num + props.currencys;
    } 
    return (
        <form className="ewallets-modal" action="https://www.sfor.trade/merchant/advcash/index.php" method="post"> 
            <div className="ewallets-modal__header">
                <img src={volet} alt="Volet Logo" draggable="false"/>
                <span>{formatMessage({id: 'deposit.with.ewallets.going.volet' })}</span>
                <span>{formatMessage({id: 'deposit.with.ewallets.minsum' })} {props.minAmount}{props.currencys}.</span>
            </div> 
            <div className="ewallets-modal__body">
                <input type="hidden" value={props.currencyUp} />
                <NumericInput  
                    id="amount"
                    name="amount"
                    placeholder={`Amount in ${props.currencyUp}`}
                    type="number"
                    step={1}
                    min={props.minAmount} 
                    max={999999} 
                    mobile
                    format={myFormat}
                    autofocus={false}
                    value={numbers}
                    onChange={value => setNumbers(value)}
                    className="numeric__input" 
                />
                <input
                    type={'hidden'} 
                    name="email"
                    value={user.email}
                />
                <p>{formatMessage({id: 'deposit.with.ewallets.going.submit' })}</p>
            </div>
            <div className="modal-window__container__footer">
                <Button
                    type="submit"
                    className="medium-button"
                    disabled={numbers < props.minAmount}
                >
                    {formatMessage({id: 'deposit.with.ewallets.button.deposit' })}
                </Button>
            </div>
        </form>
    );
}
const Voletpayment = React.memo(VoletpaymentComponent);

export {
    Voletpayment,
};
