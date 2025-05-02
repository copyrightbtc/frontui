import * as React from 'react'; 
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { kycSteps } from '../../api';
import { ProfileVerificationLevels } from './ProfileVerificationLevels';
import { Label, labelFetch, selectLabelData, selectUserInfo, User, selectMobileDeviceState } from '../../modules';
import { getVerificationStep } from '../../helpers';

/* Icons */
import { CheckReady } from '../../assets/images/kyc/CheckReady';
import { CheckClose } from '../../assets/images/kyc/CheckClose';
import { ClocksIcon } from '../../assets/images/kyc/ClocksIcon'; 

//import { CheckMail } from '../../assets/images/kyc/CheckMail';
import { CheckPhone } from '../../assets/images/kyc/CheckPhone';
import { CheckProfile } from '../../assets/images/kyc/CheckProfile';
import { CheckDocument } from '../../assets/images/kyc/CheckDocument';

interface ReduxProps {
    labels: Label[];
    isMobileDevice?: boolean;
}

interface DispatchProps {
    labelFetch: typeof labelFetch;
}

interface ProfileVerificationProps {
    user: User;
    showModal?: boolean;
}

type Props =  DispatchProps & ProfileVerificationProps & ReduxProps;
 

class ProfileVerificationComponent extends React.Component<Props> {
    public componentDidMount() {
        this.props.labelFetch();
    }

    public state = {
        showModal: false,
    };
 
    public renderVerificationLabel(labels: Label[], labelToCheck: string) {
        const targetLabelStatus = this.handleCheckLabel(labels, labelToCheck);

        switch (targetLabelStatus) {
            case 'verified':
                return (
                    <div className="profile-page-verification__step verified">
                        {kycSteps() && this.renderProgressBarSteps(labelToCheck)}
                        <div className="step__info">  
                            <div className="step__info__title"> 
                                <FormattedMessage id={`page.body.profile.verification.${labelToCheck}.verified.title`} />  
                            </div>
                            <div className="step__info__subtitle">
                                <FormattedMessage id={`page.body.profile.verification.${labelToCheck}.verified.subtitle`} />
                            </div>
                        </div>
                        <div className="profile-page-verification__step__label verified">
                            <FormattedMessage id="page.body.profile.verification.verified" /> 
                            <CheckReady />
                        </div>
                    </div>
                );
 
            case 'drafted':
            case 'pending':
            case 'submitted':  
                return (
                    <div className="profile-page-verification__step pending">
                        {kycSteps() && this.renderProgressBarSteps(labelToCheck)}
                        <div className="step__info">
                            <div className="step__info__title"> 
                                <FormattedMessage id={`page.body.profile.verification.${labelToCheck}.pending.title`} />
                            </div>
                            <div className="step__info__subtitle">
                                <FormattedMessage id={`page.body.profile.verification.${labelToCheck}.subtitle`} />
                            </div>
                        </div>
                        <div className="profile-page-verification__step__label pending"> 
                            <span><FormattedMessage id="page.body.profile.verification.staus.label" /> </span>
                            <FormattedMessage id="page.body.profile.verification.pending" /> 
                            <ClocksIcon />
                        </div>
                    </div>
                );
            case 'rejected':  
                return (
                    <div className="profile-page-verification__step rejected">
                        {kycSteps() && this.renderProgressBarSteps(labelToCheck)}
                        <div className="rejected-icon"><CheckClose /></div>
                        <div className="step__info">
                            <div className="step__info__title">
                                <FormattedMessage id={`page.body.profile.verification.${labelToCheck}.rejected.title`} />
                            </div>                            
                            <div className="step__info__subtitle"> 
                                <FormattedMessage id={`page.body.profile.verification.rejected.tooltip`} />
                            </div> 
                        </div> 
                            <div className="profile-page-verification__step__button rejected"> 
                                <Link
                                    className='ver-button'
                                    to="/profiles/kyc-steps"
                                >
                                    <FormattedMessage id="page.body.profile.verification.tryagain" />
                                </Link>
                            </div> 
                    </div>
                );
            case 'blocked':
                return (
                    <div className="profile-page-verification__step">
                        {kycSteps() && this.renderProgressBarSteps(labelToCheck)}
                        <div className="step__info">
                            <div className="step__info__title"> 
                                <FormattedMessage id={`page.body.profile.verification.${labelToCheck}.title`} />
                            </div>
                            <div className="step__info__subtitle">
                                <FormattedMessage id={`page.body.profile.verification.${labelToCheck}.subtitle`} />
                            </div>
                        </div>
                        <div className="profile-page-verification__step__button blocked">
                            <Link
                                className='ver-button'
                                to="/profiles/kyc-steps"
                            >
                                <FormattedMessage id="page.body.profile.verification.verify" />
                            </Link>
                        </div>
                    </div>
                );
            default:
                return (
                    <div className="profile-page-verification__step active"> 
                        {kycSteps() && this.renderProgressBarSteps(labelToCheck)}
                        <div className="step__info">
                            <div className="step__info__title"> 
                                <FormattedMessage id={`page.body.profile.verification.${labelToCheck}.title`} />
                            </div>
                            <div className="step__info__subtitle">
                                <FormattedMessage id={`page.body.profile.verification.${labelToCheck}.subtitle`} />
                            </div>
                        </div>
                        <div className="profile-page-verification__step__button">
                            <Link
                                className='ver-button'
                                to="/profiles/kyc-steps"
                            >
                                <FormattedMessage id="page.body.profile.verification.verify" />
                            </Link>
                        </div>
                    </div>
                );
        }
    }
 
    public renderProgressBarSteps = (targetLabelStatus) => {
        switch (targetLabelStatus) {  
            case 'phone' : return (<div className="verification-icons"><CheckPhone /></div> );
            case 'profile': return (<div className="verification-icons"><CheckProfile /></div> );
            case 'document': return (<div className="verification-icons"><CheckDocument /></div> );
            //case 'address': return (<div className="verification-icons"><CheckDocument /></div> );
 
            default: return ('');
        }
    };
 
    public render() {
        const { labels, isMobileDevice } = this.props; 

        return (
            <div id="prof-ver" className="profile-page-verification"> 
               {!isMobileDevice && <ProfileVerificationLevels />}
                <div className="profile-page-verification__wrapper">
                    {kycSteps().map((step: string) => this.renderVerificationLabel(labels, step))}
                </div>
            </div>
        );
    };

    private handleCheckLabel = (labels: Label[], labelToCheck: string) => {
        const targetLabel = labels.length && labels.find((label: Label) => label.key === labelToCheck && label.scope === 'private');
        let targetLabelStatus = targetLabel ? targetLabel.value : ''; 
        const indexOfPrevStep = kycSteps().indexOf(labelToCheck) - 1;

        if (indexOfPrevStep !== -1) {
			const prevStepPassed = Boolean(
                labels.find(
                    (label: Label) =>
                        label.key === kycSteps()[indexOfPrevStep] &&
                        label.value === 'verified' &&
                        label.scope === 'private'
                )
			);
            if (!prevStepPassed) {
                targetLabelStatus = 'blocked';
            }
        }

        return targetLabelStatus;
    };
}

const mapStateToProps = state => ({
    user: selectUserInfo(state),
    labels: selectLabelData(state),
    isMobileDevice: selectMobileDeviceState(state),
});

const mapDispatchProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        labelFetch: () => dispatch(labelFetch()),
    });

export const ProfileVerification = connect(mapStateToProps, mapDispatchProps)(ProfileVerificationComponent);

