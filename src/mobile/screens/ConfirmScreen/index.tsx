import * as React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { RouterProps } from 'react-router';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { CSSTransition } from "react-transition-group";
import { IconButton } from '@mui/material';
import { CloseIcon } from 'src/assets/images/CloseIcon';
import { OverlayTrigger } from 'react-bootstrap';
import { Tooltip } from 'src/components';
import { InfoIcon } from 'src/assets/images/InfoIcon';
import { IntlProps } from '../../../';
import { kycSteps } from 'src/api';
import { getVerificationStep, setDocumentTitle } from 'src/helpers';
import { ModalMobile } from '../../components/ModalMobile';

import {
    Documents, 
    Identity, 
    Phone,
} from 'src/containers';
import {
    ProfileVerificationMobileScreen,
} from 'src/mobile/screens';

import {
    Label,
    labelFetch,
    RootState,
    selectLabelData,
    selectMobileDeviceState,
} from 'src/modules';

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
            <React.Fragment>
                <ProfileVerificationMobileScreen />
                <ModalMobile
                    isOpen={this.state.showModal}
                    classNames='maxheight'
                > 
                    <div className="mobile-modal__header">
                        <div className="mobile-modal__header-title">
                            <FormattedMessage id={`page.confirm.title.${step}`} />
                            <OverlayTrigger 
                                placement="auto"
                                delay={{ show: 250, hide: 300 }} 
                                overlay={<Tooltip className="themes" title="page.body.profile.verification.pleasenote.alert" />}>
                                    <div className="tip_icon_container">
                                        <InfoIcon />
                                    </div>
                            </OverlayTrigger>
                        </div>
                        <div className="mobile-modal__header-close" onClick={() => this.props.history.push('/profile/verification')}>
                            <CloseIcon />
                        </div>
                    </div>   
                    <div className="verification-modal">
                        <div className="verification-modal__content"> 
                            {this.renderVerificationStep(step)}
                        </div> 
                    </div> 
                </ModalMobile>
            </React.Fragment>
        );
    }

    private handleGetVerificationStep = (): string => {
        const { labels } = this.props;

        return getVerificationStep(labels);
    };

    private handleCheckUserLabels = (labels: Label[]) => {
        const pendingLabelExists = Boolean(labels.find(label => kycSteps().includes(label.key) && ['pending', 'drafted', 'submitted'].includes(label.value) && label.scope === 'private'));
        const passedSteps = kycSteps().filter((step: string) => labels.find(label => step === label.key && label.value === 'verified' && label.scope === 'private'));

        if (pendingLabelExists || (kycSteps().length === passedSteps.length)) {
            this.props.history.push('/profile/verification');
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

export const ConfirmMobileScreen = compose(
    injectIntl,
    withRouter,
    connect(mapStateToProps, mapDispatchToProps),
)(ConfirmComponent) as any; 
