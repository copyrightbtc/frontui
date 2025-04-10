import React, { Fragment, useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { RotateSpinner } from 'react-spinners-kit';
import { DELAY_AFTER_VERIFICATION_REQUEST } from '../../constants';

const CountdownTimer = ({
  intl,
  renderCaptcha,
  onCountdownComplete,
  onButtonClick,
  isButtonDisabled,
  emailVerificationLoading
}) => {
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        let interval: number;

        if (seconds > 0) {
            interval = window.setInterval(() => {
                setSeconds((prevSeconds) => prevSeconds - 1);
            }, 1000);
        } else if (seconds === 0) {
            onCountdownComplete();
        }

        return () => {
            clearInterval(interval);
        };
    }, [seconds, onCountdownComplete]);

    return (
        <Fragment>
          <div className="login-form__content__title"> 
              {intl.formatMessage({ id: 'page.header.signUp.modal.body' })}
              <h3>{seconds > 0 ? <>{intl.formatMessage({ id: 'page.header.signUp.modal.resendtext' })}{seconds}</> : intl.formatMessage({ id: 'page.header.signUp.modal.body2' })}</h3>
          </div>
          <div className="login-form__button">
              <Button
                  className="big-button"
                  disabled={isButtonDisabled || seconds > 0} 
                  onClick={(e) => {
                    onButtonClick(e);
                    setSeconds(DELAY_AFTER_VERIFICATION_REQUEST);
                  }}
              >
              {emailVerificationLoading ? <RotateSpinner size={29} color="#000"/> : intl.formatMessage({ id: 'page.resendConfirmation' })}
              </Button>
          </div>
          {renderCaptcha}
        </Fragment>
    );
};

export { CountdownTimer };
