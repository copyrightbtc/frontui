import * as React from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { useDispatch, useSelector } from 'react-redux';
import { GeetestCaptcha } from '../../containers';
import { useSetShouldGeetestReset } from '../../hooks';
import {
    GeetestCaptchaResponse,
    selectAuthConfigs,
    selectShouldGeetestReset,
    setGeetestCaptchaSuccess,
    setRecaptchaSuccess,
} from '../../modules';

export const CaptchaComponent = props => {
    const dispatch = useDispatch();
    const configsAuth = useSelector(selectAuthConfigs);
    const shouldGeetestReset = useSelector(selectShouldGeetestReset);

    let reCaptchaRef;

    reCaptchaRef = React.useRef();
    const geetestCaptchaRef = React.useRef(null);

    React.useEffect(() => {
        if (props.error || props.success) {
            if (reCaptchaRef.current) {
                reCaptchaRef.current.reset();
            }
        }
    }, [props.error, props.success, reCaptchaRef]);

    useSetShouldGeetestReset(props.error, props.success, geetestCaptchaRef);

    const handleRecaptchaChange = (value: string) => {
        dispatch(setRecaptchaSuccess({ captcha_response: value }));
    };

    const handleGeetestCaptchaChange = (value?: GeetestCaptchaResponse) => {
        dispatch(setGeetestCaptchaSuccess({ captcha_response: value }));
    };

    const renderCaptcha = () => {
        switch (configsAuth.captcha_type) {
            case 'recaptcha':
                return (
                    <div className="captcha--recaptcha">
                        <ReCAPTCHA
                            ref={reCaptchaRef}
                            //sitekey={'6LcUp-QpAAAAADwWOEuheI_1o12N0SetvjKVYP32'}
                            sitekey={configsAuth.captcha_id}
                            onChange={handleRecaptchaChange}
                        />
                    </div>
                );
            case 'geetest':
                return (
                    <div className="captcha--geetest">
                        <GeetestCaptcha
                            ref={geetestCaptchaRef}
                            shouldCaptchaReset={shouldGeetestReset}
                            onSuccess={handleGeetestCaptchaChange}
                        />
                    </div>
                );
            default:
                return null;
        }
    };

    return renderCaptcha();
};

export const Captcha = React.memo(CaptchaComponent);
