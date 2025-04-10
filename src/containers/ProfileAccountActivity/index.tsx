import classnames from 'classnames';
import * as React from 'react';
import { injectIntl } from 'react-intl'; 
import { Button } from '@mui/material';
import { ReadMoreIcon } from 'src/assets/images/ReadMoreIcon';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { IntlProps } from '../../'; 
import { getUserAgent, localeDate } from '../../helpers';
import { NoResultData } from 'src/components';
import {
    getUserActivity,
    RootState,
    selectTotalNumber,
    selectUserActivity,
    selectUserActivityCurrentPage,
    selectUserActivityLoading,
    UserActivityDataInterface,
} from '../../modules';

interface ReduxProps {
    loading: boolean;
    total: number;
    page: number;
    userActivity: UserActivityDataInterface[];
}

interface DispatchProps {
    getUserActivity: typeof getUserActivity;
}

const paginationLimit = 5;

type Props = ReduxProps & DispatchProps & IntlProps;

class ProfileAccountActivityComponent extends React.Component<Props> {
    public componentDidMount() {
        this.props.getUserActivity({ page: 0, limit: paginationLimit });
    }

    public render() {
        const { loading, userActivity } = this.props;

        return (
            <div className="profile-section blank">
                <div className="profile-section__content">
                    <div className="profile-section__content__header">
                        <h2>{this.props.intl.formatMessage({id: 'page.body.profile.header.accountActivity'})}</h2>
                        <Button
                            href='/history/account-activity'
                            className="little-button blue"
                        >
                            {this.props.intl.formatMessage({id: 'page.body.profile.content.action.more'})}
                            <ReadMoreIcon className='read-more'/>
                        </Button>
                    </div>
                    <div className={`profile-activity ${userActivity.length ? '' : 'profile-activity__empty'}`}>
                        {userActivity.length ? this.renderContent() : null}
                        {!userActivity.length && !loading ?  
                            <NoResultData title={this.props.intl.formatMessage({id: 'page.body.profile.header.accountActivity.nodata'})}/>
                        : null}
                    </div>
                </div>
            </div>
        );
    }

    public renderContent = () => {
        const { userActivity } = this.props;

        return (
            <table className="table-main with-hover">
                <thead>{this.getHeaders()}</thead>
                <tbody>{this.getActivityData(userActivity)}</tbody>
            </table>
        );
    };

    private getHeaders = () => {
        return [
            <tr> 
                <th className="date">{this.props.intl.formatMessage({id: 'page.body.profile.header.accountActivity.content.date'})}</th>
                <th>{this.props.intl.formatMessage({id: 'page.body.profile.header.accountActivity.content.action'})}</th>
                <th className="right">{this.props.intl.formatMessage({id: 'page.body.profile.header.accountActivity.content.addressip'})}</th>
                <th >{this.props.intl.formatMessage({id: 'page.body.profile.header.accountActivity.content.country'})}</th>
                <th className="right">{this.props.intl.formatMessage({id: 'page.body.profile.header.accountActivity.content.userAgent'})}</th>
                <th className="right">{this.props.intl.formatMessage({id: 'page.body.profile.header.accountActivity.content.result'})}</th>
            </tr>
        ];
    };

    private getActivityData(userData: UserActivityDataInterface[]) {
        return userData.map(item => {
            return [
                <tr>
                    <td>
                        <div className="date-split">
                            <div className="date">{localeDate(item.created_at, 'date')}</div>
                            <div className="time">{localeDate(item.created_at, 'time')}</div>
                        </div>
                    </td>
                    <td>{this.getResultOfUserAction(item.action)}</td> 
                    <td className="right">{item.user_ip}</td>
                    <td>{item.user_ip_country}</td>
                    <td className="right">{getUserAgent(item.user_agent)}</td>  
                    <td className="right">{this.renderResult(this.props.intl.formatMessage({ id: `page.body.profile.content.result.${item.result}`}))}</td>
                </tr>
            ];
        });
    } 

    private renderResult(result: string) {
        const className = classnames({
            'table-succeed': result === this.props.intl.formatMessage({id: 'page.body.profile.content.result.succeed'}),
            'table-danger':  result === this.props.intl.formatMessage({id: 'page.body.profile.content.result.failed'}) ||
                                                 result === this.props.intl.formatMessage({id: 'page.body.profile.content.result.denied'}),
        });

        return <span className={className}>{result}</span>;
    }

    private getResultOfUserAction = (value: string) => {
        switch (value) {
            case 'login':
                return this.props.intl.formatMessage({ id: 'page.body.profile.content.action.login'});
            case 'signup':
                return this.props.intl.formatMessage({ id: 'page.body.profile.content.action.signup'});
            case 'logout':
                return this.props.intl.formatMessage({ id: 'page.body.profile.content.action.logout'});
            case 'request QR code for 2FA':
                return this.props.intl.formatMessage({ id: 'page.body.profile.content.action.request2fa'});
            case 'enable 2FA':
                return this.props.intl.formatMessage({ id: 'page.body.profile.content.action.enable2fa'});
            case 'login::2fa':
                return this.props.intl.formatMessage({ id: 'page.body.profile.content.action.login.2fa'});
            case 'request password reset':
                return this.props.intl.formatMessage({ id: 'page.body.profile.content.action.requestPasswordReset'});
            case 'password reset':
                return this.props.intl.formatMessage({ id: 'page.body.profile.content.action.passwordReset'});
            default:
                return value;
        }
    };
 
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    userActivity: selectUserActivity(state),
    loading: selectUserActivityLoading(state),
    total: selectTotalNumber(state),
    page: selectUserActivityCurrentPage(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        getUserActivity: params => dispatch(getUserActivity(params)),
    });

export const ProfileAccountActivity = injectIntl(connect(mapStateToProps, mapDispatchToProps)(ProfileAccountActivityComponent)) as any;
