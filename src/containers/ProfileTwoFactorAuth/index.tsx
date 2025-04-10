import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import { Button } from '@mui/material';
import { selectMobileDeviceState } from '../../modules';
import { TwoFaDisable } from '../../assets/images/TwoFaDisable';
import { TwoFaEnable } from '../../assets/images/TwoFaEnable';
 

export const ProfileTwoFactorAuth = props => {
    const { is2faEnabled = false } = props;
    const classNameButton = is2faEnabled ? 'profile_2fa-block__button__enabled'
                                    : 'profile_2fa-block__button__disabled';
                                    

    const handleToggle2fa = () => {
        if (props.navigateTo2fa) {
            props.navigateTo2fa(!is2faEnabled);
        }
    };

    const isMobileDevice = useSelector(selectMobileDeviceState);

    return (
        <React.Fragment>
            {isMobileDevice ? ( 
                <div className="mobile profile_2fa-block"> 
              
                    <h5>
                        {is2faEnabled ? <div><TwoFaEnable /><FormattedMessage id="mob.body.profile.header.account.content.twofascreen.message.enabled" /> </div>   
                                      : <div><TwoFaDisable /><FormattedMessage id="mob.body.profile.header.account.content.twofascreen.message.disabled" /> </div>   
                        }
                                 
                    </h5> 
                    <div className={classNameButton}>
                        <Button
                            className="medium-button"
                            onClick={handleToggle2fa}
                        >
                            {is2faEnabled ? <FormattedMessage id="page.body.profile.content.twofascreen.message.enable" />
                                            : <FormattedMessage id="page.body.profile.content.twofascreen.message.disable" />
                            }
                        </Button>
                    </div> 
                </div>

                ) : (

                <div className="profile_2fa-block">
                    <div className="profile_2fa-block__info"> 
                    {is2faEnabled ? (
                        <div className="profile_2fa-block__info__enabled">
                            <div className="profile_2fa-block__info__up">
                                <h5><FormattedMessage id="page.body.profile.content.twofascreen.alert.high" /></h5>
                                <TwoFaEnable />
                            </div> 
                            <p><FormattedMessage id="page.body.profile.content.twofascreen" /></p>
                        </div>
                         
                        ) : (   
                        <div className="profile_2fa-block__info">
                            <div className="profile_2fa-block__info__up">
                                <h5><FormattedMessage id="page.body.profile.content.twofascreen.alert" /></h5>
                                <TwoFaDisable />
                            </div> 
                            <p><FormattedMessage id="page.body.profile.content.twofascreen.alert.bottom" /></p>
                        </div> 
                        )
                                     
                    }
                    </div>
                    <div className="profile_2fa-block__button">
                        <div className={classNameButton}>
                            <Button
                                className="small-button"
                                onClick={handleToggle2fa}
                            >
                            {is2faEnabled ? <FormattedMessage id="page.body.profile.content.twofascreen.message.enable" />
                                            : <FormattedMessage id="page.body.profile.content.twofascreen.message.disable" />
                            }
                            </Button>
                        </div> 
                    </div>
                </div>    
            )} 
        </React.Fragment>
    );
};
