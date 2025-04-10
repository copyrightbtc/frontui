import classnames from 'classnames';
import * as React from 'react';
import { injectIntl } from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { IntlProps } from '../../'; 
import { getUserAgent, localeDate } from '../../helpers';
import { NoResultData, Pagination } from 'src/components';
import DatePicker from 'react-date-picker';
import { Button } from '@mui/material';
import { CalendarIcon } from '../../assets/images/CalendarIcon';
import {
    getUserActivity,
    RootState,
    selectTotalNumber,
    selectUserActivity,
    selectUserActivityCurrentPage,
    selectUserActivityFirstElemIndex,
    selectUserActivityLastElemIndex,
    selectUserActivityLoading,
    selectUserActivityNextPageExists,
    selectUserActivityPageCount,
    UserActivityDataInterface,
} from '../../modules';

interface ReduxProps {
    loading: boolean;
    total: number;
    page: number;
    pageCount: number;
    firstElemIndex: number;
    lastElemIndex: number;
    nextPageExists: boolean;
    userActivity: UserActivityDataInterface[];
}

interface DispatchProps {
    getUserActivity: typeof getUserActivity;
}

interface HistoryState {
    filters: {
        [key: string]: any
    };
}

const paginationLimit = 25;

type Props = ReduxProps & DispatchProps & IntlProps;

class AccountActivitiesComponent extends React.Component<Props, HistoryState> {
    constructor(props: Props | Readonly<Props>) {
        super(props);
        this.state = {
            filters: {},
        }
    }

    public componentDidMount() {
        const { filters } = this.state;
        const fetchParams = {
            page: 0,
            limit: paginationLimit,
            ...(filters && Object.entries(filters).reduce((acc, [key, value]) => {
                if (key === 'time_from' || key === 'time_to') {
                    value = value ? new Date(value).getTime() / 1000 : undefined;
                }
                if (typeof value === 'object' && value['value']) {
                    value = value['value']
                }
                
                return { ...acc, [key]: value };
            }, {}))
        };

        this.props.getUserActivity(fetchParams);
    }

    public render() {
        const { loading, userActivity } = this.props;

        return (
            <div className="profile-history__wrapper">
                {this.renderFilterRow()}
                <div className={`profile-activity ${userActivity.length ? '' : 'profile-activity__empty'}`}>
                    {userActivity.length ? this.renderContent() : null}
                    {!userActivity.length && !loading ?  
                        <NoResultData title={this.props.intl.formatMessage({id: 'page.body.profile.header.accountActivity.nodata'})}/>
                    : null}
                </div>
            </div>
        );
    }

    private renderFilterRow = () => {
        const today = new Date().toISOString().split('T')[0];

        return (
            <div className="filter-elements">
                <div className="filter-elements__left">
                    <div className="filter-cell__dates">
                        <div className="cell-date">
                            <div className="suffix-date">{this.props.intl.formatMessage({ id: 'page.body.filters.dateFrom' })}</div>
                            <DatePicker
                                className="input-date"  
                                onChange={this.handleDateFrom}
                                value={this.state.filters?.time_from || ''}
                                maxDate = {new Date(this.state.filters?.time_to || new Date(today))}
                                format="dd-MM-y"
                                calendarIcon={<CalendarIcon />}
                                dayPlaceholder={this.props.intl.formatMessage({ id: 'page.body.filters.dd' })}
                                monthPlaceholder={this.props.intl.formatMessage({ id: 'page.body.filters.mm' })}
                                yearPlaceholder={this.props.intl.formatMessage({ id: 'page.body.filters.yy' })}
                            />
                        </div>
                        <hr/>
                        <div className="cell-date">
                            <div className="suffix-date">{this.props.intl.formatMessage({ id: 'page.body.filters.dateTo' })}</div>
                            <DatePicker
                                className="input-date"  
                                onChange={this.handleDateTo}
                                value={this.state.filters?.time_to || ''}
                                minDate={new Date(this.state.filters?.time_from || null)}
                                maxDate={new Date(today)}
                                format="dd-MM-y"
                                calendarIcon={<CalendarIcon />}
                                dayPlaceholder={this.props.intl.formatMessage({ id: 'page.body.filters.dd' })}
                                monthPlaceholder={this.props.intl.formatMessage({ id: 'page.body.filters.mm' })}
                                yearPlaceholder={this.props.intl.formatMessage({ id: 'page.body.filters.yy' })}
                            />
                        </div>
                    </div>
                </div>
                <div className="filter-elements__right">
                    <Button 
                        className="search-button" 
                        onClick={this.handleSearch}
                    >
                        {this.props.intl.formatMessage({ id: 'page.body.filters.search' })}
                    </Button>
                    <Button 
                        className="reset-button" 
                        onClick={this.handleReset}
                    >
                        {this.props.intl.formatMessage({ id: 'page.body.filters.reset' })}
                    </Button>
                </div>
            </div>
        );
    }

    private handleDateFrom = (value: Date) => {
        this.setState(prevState => ({
            filters: {
                ...prevState.filters,
                time_from: value,
            },
        }));
    };
    private handleDateTo = (value: Date) => {
        this.setState(prevState => ({
            filters: {
                ...prevState.filters,
                time_to: value,
            },
        }));
    };

    private handleSearch = () => {
        const { filters } = this.state;
        const filterParams = {
            page: 0,
            limit: paginationLimit,
            ...(filters && Object.entries(filters).reduce((acc, [key, value]) => {
                if (key === 'time_from' || key === 'time_to') {
                    value = value ? new Date(value).getTime() / 1000 : undefined;
                }
                if (typeof value === 'object' && value['value']) {
                    value = value['value']
                }
                
                return { ...acc, [key]: value };
            }, {}))
        };
    
        this.props.getUserActivity(filterParams);
    };

    private handleReset = () => {
        this.setState({ filters: {} }, () => {
            const filterParams = {
                page: 0,
                limit: paginationLimit,
            };
            this.props.getUserActivity(filterParams);
        });
    };
    
    public renderContent = () => {
        const { total, firstElemIndex, lastElemIndex, page, nextPageExists, userActivity } = this.props;

        return (
            <React.Fragment>
                <table className="table-main with-hover">
                    <thead>{this.getHeaders()}</thead>
                    <tbody>{this.getActivityData(userActivity)}</tbody>
                </table>
                <Pagination
                    firstElemIndex={firstElemIndex}
                    lastElemIndex={lastElemIndex}
                    totalCount={total}
                    page={page}
                    nextPageExists={nextPageExists}
                    onClickPrevPage={this.onClickPrevPage}
                    onClickNextPage={this.onClickNextPage}
                />
            </React.Fragment>
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

    private onClickPrevPage = () => {
        const { page } = this.props;
        const { filters } = this.state;

        this.props.getUserActivity({
            page: Number(page) - 1,
            limit: paginationLimit,
            ...(filters && Object.entries(filters).reduce((acc, [key, value]) => {
                if (key === 'time_from' || key === 'time_to') {
                    value = value ? new Date(value).getTime() / 1000 : undefined;
                }
                if (typeof value === 'object' && value['value']) {
                    value = value['value']
                }
                
                return { ...acc, [key]: value };
            }, {}))
        });
    };

    private onClickNextPage = () => {
        const { page } = this.props;
        const { filters } = this.state;

        this.props.getUserActivity({
            page: Number(page) + 1,
            limit: paginationLimit,
            ...(filters && Object.entries(filters).reduce((acc, [key, value]) => {
                if (key === 'time_from' || key === 'time_to') {
                    value = value ? new Date(value).getTime() / 1000 : undefined;
                }
                if (typeof value === 'object' && value['value']) {
                    value = value['value']
                }
                
                return { ...acc, [key]: value };
            }, {}))
        });
    };

}

const mapStateToProps = (state: RootState): ReduxProps => ({
    userActivity: selectUserActivity(state),
    loading: selectUserActivityLoading(state),
    total: selectTotalNumber(state),
    page: selectUserActivityCurrentPage(state),
    pageCount: selectUserActivityPageCount(state, paginationLimit),
    firstElemIndex: selectUserActivityFirstElemIndex(state, paginationLimit),
    lastElemIndex: selectUserActivityLastElemIndex(state, paginationLimit),
    nextPageExists: selectUserActivityNextPageExists(state, paginationLimit),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        getUserActivity: params => dispatch(getUserActivity(params)),
    });

export const AccountActivities = injectIntl(connect(mapStateToProps, mapDispatchToProps)(AccountActivitiesComponent)) as any;
