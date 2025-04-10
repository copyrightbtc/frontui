import * as React from 'react';
import { injectIntl } from 'react-intl';
import { connect, MapStateToProps } from 'react-redux';
import { RouterProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { IntlProps } from '../../';
import { setDocumentTitle } from '../../helpers';
import { RootState, selectPlatformAccessStatus } from '../../modules';
import { Button } from 'react-bootstrap';
// Icons
import ErrorIcon from '../../assets/images/404.svg';

interface ReduxProps {
    status: string;
}

type Props = RouterProps & IntlProps & ReduxProps;

class Restricted extends React.Component<Props> {
    public componentDidMount() {
        setDocumentTitle(this.props.intl.formatMessage({id: 'page.body.screen.title.pagenotfound.title'})); 
    }
     
    public render() {
        const { history } = this.props;
        return(
            <div className="notfound-wrapper">
            <div className="notfound"> 
                <img src={ErrorIcon} alt='page not found' draggable="false" /> 
                <div className="notfound-links">
                    <h1>{this.props.intl.formatMessage({id: 'page.body.screen.title.pagenotfound.h1'})}</h1>
                    <p>{this.props.intl.formatMessage({id: 'page.body.screen.title.pagenotfound.text1'})}</p>
                    <p>{this.props.intl.formatMessage({id: 'page.body.screen.title.pagenotfound.text2'})}<Button onClick={() => history.push('/')}>{this.props.intl.formatMessage({id: 'page.body.screen.title.pagenotfound.homepage'})}</Button> {this.props.intl.formatMessage({id: 'page.body.land.button.or'})} <Button onClick={() => history.goBack()}>{this.props.intl.formatMessage({id: 'page.body.profile.content.back'})}</Button>.</p> 
                </div>
            </div>
        </div>
        );
    }
 
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
    status: selectPlatformAccessStatus(state),
});

export const RestrictedScreen = compose(
    injectIntl,
    withRouter,
    connect(mapStateToProps),
)(Restricted) as React.ComponentClass;
