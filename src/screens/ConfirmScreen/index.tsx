import * as React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { RouterProps } from 'react-router';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { CSSTransition } from "react-transition-group";
import { IconButton } from '@mui/material';
import { CloseIcon } from '../../assets/images/CloseIcon';
import { OverlayTrigger } from 'react-bootstrap';
import { Tooltip } from '../../components';
import { InfoIcon } from 'src/assets/images/InfoIcon';
import { IntlProps } from '../../';
import { kycSteps } from '../../api';
import { getVerificationStep, setDocumentTitle } from '../../helpers';

import {
    Documents, 
    Identity, 
    Phone,
    ProfileAccountActivity, 
    ProfileVerification,
    ProfileSecurity,
    Sidebar,
    ProfileHeader,
    UserLevelInfo,
} from 'src/containers';

import {
    Label,
    labelFetch,
    RootState,
    selectLabelData,
    selectMobileDeviceState,
} from '../../modules';

interface ReduxProps {
    labels: Label[];
    isMobileDevice: boolean;
    showModal?: boolean;
    fixed?: number
}

interface DispatchProps {
    labelFetch: typeof labelFetch;
}

type Props = ReduxProps & DispatchProps & RouterProps & IntlProps;

class ConfirmComponent extends React.Component<Props> {
    public componentDidMount() {
        const { labels } = this.props; 
        setDocumentTitle(this.props.intl.formatMessage({id: 'page.body.header.up.titles.profileverification'}));
        this.props.labelFetch();

        if (labels.length) {
            this.handleCheckUserLabels(labels);
        }
    }

    public state = {
        showModal: false,
    };

    public componentDidUpdate(prevProps: Props) {
        const { labels } = this.props;

        if (labels.length && JSON.stringify(labels) !== JSON.stringify(prevProps.labels)) {
            this.handleCheckUserLabels(labels);
        }
        setTimeout(() => this.setState({showModal: true}), 100)
    }

    public renderVerificationStep = (step: string) => {
        switch (step) {
            case 'phone':    return <Phone />;
            case 'profile':  return <Identity />;
            case 'document': return <Documents />; 
            //case 'address': return <Identity />; 
            default: return 'Something went wrong';
        }
    };
    public hi = () => {
         
    }
    public render() {
        const step = this.handleGetVerificationStep();

        return (
            <div className="accountpage-wrapper">
                <Sidebar />
                <div className="accountpage-wrapper__right">
                    <ProfileHeader />
                    <div className="profile-page">
                        <UserLevelInfo fixed={this.props.fixed} /> 
                        <ProfileAccountActivity />
                        <ProfileSecurity />
                        <ProfileVerification />
                            <CSSTransition
                                in={this.state.showModal}
                                timeout={{
                                    enter: 100,
                                    exit: 400
                                }}
                                unmountOnExit
                            >
                            <div className="modal-window">
                                <div className="modal-window__container verification fadet"> 
                                    <div className="verification-modal">
                                        <div className="modal-window__container__header">
                                            <h1>
                                                <OverlayTrigger 
                                                    placement="auto"
                                                    delay={{ show: 250, hide: 300 }} 
                                                    overlay={<Tooltip title="page.body.profile.verification.pleasenote.alert" />}>
                                                        <div className="tip_icon_container">
                                                            <InfoIcon />
                                                        </div>
                                                </OverlayTrigger>
                                                <FormattedMessage id={`page.confirm.title.${step}`} />
                                            </h1>
                                            <div className="modal-window__container__header__close">
                                                <IconButton
                                                    onClick={() => this.props.history.push('/profile')}
                                                    sx={{
                                                        color: '#fff',
                                                        '&:hover': {
                                                            color: 'var(--accent)'
                                                        }

                                                    }}
                                                >
                                                    <CloseIcon className="icon_closeed"/>
                                                </IconButton>
                                            </div> 
                                        </div>
                                        <div className="verification-modal__content"> 
                                            {this.renderVerificationStep(step)}
                                        </div> 
                                    </div>
                                </div>
                            </div> 
                        </CSSTransition>
                    </div> 
                </div>
            </div>
        );
    }

    private toggleChangeModal = () => {
        this.setState({
            showModal: !this.state.showModal,
        });
    };
    private closeModal = () => {
        this.setState({
            showModal: false,
        });
    };

    private handleGetVerificationStep = (): string => {
        const { labels } = this.props;

        return getVerificationStep(labels);
    };

    private handleCheckUserLabels = (labels: Label[]) => {
        const pendingLabelExists = Boolean(labels.find(label => kycSteps().includes(label.key) && ['pending', 'drafted', 'submitted'].includes(label.value) && label.scope === 'private'));
        const passedSteps = kycSteps().filter((step: string) => labels.find(label => step === label.key && label.value === 'verified' && label.scope === 'private'));

        if (pendingLabelExists || (kycSteps().length === passedSteps.length)) {
            this.props.history.push('/profile');
        }
    };
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    labels: selectLabelData(state),
    isMobileDevice: selectMobileDeviceState(state),
});

const mapDispatchToProps = dispatch => ({
    labelFetch: () => dispatch(labelFetch()),
});

export const ConfirmScreen = compose(
    injectIntl,
    withRouter,
    connect(mapStateToProps, mapDispatchToProps),
)(ConfirmComponent) as any; 
