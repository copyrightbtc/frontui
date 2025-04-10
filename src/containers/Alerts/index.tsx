import * as React from 'react';
import { Alert } from 'react-bootstrap';
import FadeIn from 'react-fade-in';
import { CloseIcon } from '../../assets/images/CloseIcon';
import {
    injectIntl,
} from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { IntlProps } from '../../';
import {
    alertDelete,
    alertDeleteByIndex,
    AlertState,
    RootState,
    selectAlertState,
} from '../../modules';

interface ReduxProps {
    alerts: AlertState;
}

interface DispatchProps {
    alertDelete: typeof alertDelete;
    alertDeleteByIndex: typeof alertDeleteByIndex;
}

type Props = ReduxProps & DispatchProps & IntlProps;
 
class AlertComponent extends React.Component<Props> {
    public deleteAlertByIndex = (key: number) => {
        this.props.alertDeleteByIndex(key);
    };

    public translate = (id: string) => {
        return id ? this.props.intl.formatMessage({ id }) : '';
    };

    public render() {
 
        return (
            <div className="top-alerts">
                {this.props.alerts.alerts.map(w => w.message.map((msg, index) => (
                    <FadeIn key={index}>
                        <div className="top-alerts__wrapper">
                            <Alert
                                // @ts-ignore
                                variant={w.type === 'error' ? 'danger' : w.type}
                            >
                                <div className="top-alerts__wrapper__left"> 
                                {w.type === 'error' ? (
                                    <div className="icon">
                                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 24 24">
                                            <circle cx="12" cy="19" r="2" fill="var(--danger)"></circle><path d="M10 3h4v12h-4z" fill="var(--danger)"></path>
                                        </svg>
                                    </div>
                                    ) : (
                                    <div className="icon">
                                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 24 24">
                                            <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="var(--success)"></path>
                                        </svg>
                                    </div>
                                )}
                                </div>
                                <div className="top-alerts__wrapper__right"> 
                                    <span className="close_text">
                                        {this.translate(msg)}
                                    </span>
                                    <div className="close_icon" onClick={() => this.deleteAlertByIndex(index)}><CloseIcon /></div> 
                                </div>
                            </Alert>
                        </div>
                    </FadeIn>
                )))}
            </div>
        );
    }
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    alerts: selectAlertState(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        alertDelete: () => dispatch(alertDelete()),
        alertDeleteByIndex: payload => dispatch(alertDeleteByIndex(payload)),
    });

export const Alerts = injectIntl(connect(mapStateToProps, mapDispatchToProps)(AlertComponent)) as React.FunctionComponent;
