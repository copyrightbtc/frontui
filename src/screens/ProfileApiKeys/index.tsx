import * as React from 'react';
import { History } from 'history';
import { Link } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import { setDocumentTitle } from '../../helpers';
import { Button, IconButton } from '@mui/material';
import { CloseIcon } from '../../assets/images/CloseIcon';
import { CSSTransition } from "react-transition-group";
import { injectIntl } from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { withRouter } from 'react-router';
import { OverlayTrigger } from 'react-bootstrap';
import { Tooltip } from '../../components';
import { ReportIcon } from 'src/assets/images/ReportIcon';
import { IntlProps } from '../../';
import { DeleteIcon } from "src/assets/images/DeleteIcon";
import { BigPlusIcon } from "src/assets/images/BigPlusIcon";
import OtpInput from "react-otp-input";
import {
    CopyableTextField,
    NoResultData
} from '../../components';
import { localeDate } from '../../helpers/localeDate';
import { Sidebar, ProfileHeader } from '../../containers';
import {
    alertPush,
    ApiKeyCreateFetch,
    apiKeyCreateFetch, 
    ApiKeyDataInterface,
    ApiKeyDeleteFetch,
    apiKeyDeleteFetch,
    ApiKeys2FAModal,
    apiKeys2FAModal, 
    apiKeysFetch,
    ApiKeyStateModal, 
    ApiKeyUpdateFetch,
    apiKeyUpdateFetch,
    RootState,
    selectMobileDeviceState,
    selectUserInfo,
    User,
} from '../../modules';
import {
    selectApiKeys,
    selectApiKeysDataLoaded,
    selectApiKeysFirstElemIndex,
    selectApiKeysLastElemIndex,
    selectApiKeysModal,
    selectApiKeysNextPageExists,
    selectApiKeysPageIndex,
} from '../../modules/user/apiKeys/selectors';
import TwoFaIcon from 'src/assets/images/TwoFaIcon.svg';

interface ReduxProps {
    apiKeys: ApiKeyDataInterface[];
    dataLoaded: boolean;
    modal: ApiKeyStateModal;
    user: User;
    pageIndex: number;
    firstElemIndex: number;
    lastElemIndex: number;
    nextPageExists: boolean;
    isMobile: boolean;
}

interface ApiKeysProps {
    history: History;
}

interface DispatchProps {
    toggleApiKeys2FAModal: typeof apiKeys2FAModal;
    apiKeysFetch: typeof apiKeysFetch;
    createApiKey: typeof apiKeyCreateFetch;
    updateApiKey: typeof apiKeyUpdateFetch;
    deleteApiKey: typeof apiKeyDeleteFetch;
    fetchSuccess: typeof alertPush;
}

interface ProfileApiKeysState {
    otpCode: string;
    showModal?: boolean;
}

type Props = ReduxProps & DispatchProps & IntlProps & ApiKeysProps;

class ProfileApiKeysComponent extends React.Component<Props, ProfileApiKeysState> {
    public state = {
        otpCode: '',
        showModal: false
    };

    public translate = (key: string) => {
        return this.props.intl.formatMessage({id: key});
    };

    public copy = (id: string) => {
        const copyText: HTMLInputElement | null = document.querySelector(`#${id}`);

        if (copyText) {
            copyText.select();

            document.execCommand('copy');
            (window.getSelection() as any).removeAllRanges(); // tslint:disable-line
        }
    };

    public componentDidMount() {
        this.props.apiKeysFetch({ pageIndex: 0, limit: 20 });
        setDocumentTitle(this.props.intl.formatMessage({id: 'page.body.profile.apiKeys.header'}));
    }

    public render() {
        const {
            apiKeys,
            dataLoaded,
            user,
        } = this.props;

        const headerText = this.props.modal.action === 'createSuccess' ? this.translate('page.body.profile.apiKeys.modal.created_header')
        : this.translate('page.body.profile.apiKeys.modal.header');

 

        return (
            <div className="accountpage-wrapper">
                <Sidebar />
                <div className="accountpage-wrapper__right"> 
                    <ProfileHeader />
                    <div className="api-keys-screen">
                        <div className="api-keys-screen__header"> 
                            <h1>{this.translate('page.body.profile.apiKeys.main.header.title')}</h1>
                            <p>{this.translate('page.body.profile.apiKeys.main.header.security.1')}</p>
                            <p>{this.translate('page.body.profile.apiKeys.main.header.security.2')}</p>
                            <p>{this.translate('page.body.profile.apiKeys.main.header.security.3')}</p>
                            <p>{this.translate('page.body.profile.apiKeys.main.header.read')}<Link to={'/'}>{this.translate('page.body.profile.apiKeys.main.header.read.link')}</Link></p>
                        </div>
                        <div className="api-keys-screen__body table-main-wrapper">
                            <div className="api-keys-screen__body__header"> 
                                <h3>{this.translate('page.body.profile.apiKeys.header')}</h3>
                                <div className="api-keys-screen__body__header__button"> 
                                    {user.otp && dataLoaded && (
                                        <Button
                                            className="little-button blue"
                                            onClick={this.handleCreateKeyClick}
                                            disabled={apiKeys.length >= 20 ? true : null}
                                        >
                                            <BigPlusIcon className="bigplus"/>
                                            {this.translate('page.body.profile.apiKeys.header.create')}
                                        </Button>
                                    )}
                                    {apiKeys.length >= 20 && 
                                        <OverlayTrigger 
                                            placement="auto"
                                            delay={{ show: 250, hide: 300 }} 
                                            overlay={<Tooltip title="page.body.profile.apiKeys.header.create.reachedout" />}>
                                                <div><ReportIcon className='report-icon'/></div>
                                        </OverlayTrigger>
                                    }
                                </div>
                            </div>
                            {!user.otp ? (
                                <div className="api-keys-screen__body__otpempty">
                                    <img src={TwoFaIcon} alt="2fa" draggable="false"/>
                                    <h6>{this.translate('page.body.profile.apiKeys.noOtp')}</h6>
                                    <p>{this.translate('page.body.profile.apiKeys.noOtp.apikeys')}</p>
                                    <Button
                                        className="big-button success"
                                        onClick={this.handleNavigateTo2fa}
                                    >
                                        {this.translate('page.body.wallets.tabs.withdraw.content.enable2faButton')}
                                    </Button>
                                </div>
                            ) : (
                                dataLoaded && apiKeys.length > 0 ? (
                                    <table className="table-main with-hover">
                                        <thead>{this.getTableHeaders()}</thead>
                                        <tbody>{this.getTableData(apiKeys)}</tbody>
                                    </table>
                                ) : (
                                    <div className="api-keys-screen__body__empty">
                                        <NoResultData title={this.props.intl.formatMessage({id: 'page.body.profile.apiKeys.noKeys'})}/>
                                    </div>
                                )
                            )}

                        </div>
                        <CSSTransition
                            in={this.props.modal.active}
                            out={!this.props.modal.active}
                            timeout={{
                                enter: 100,
                                exit: 400
                            }}
                            unmountOnExit
                        >
                            <div className="modal-window"> 
                                <div className="modal-window__container fadet wide">
                                    <div className="modal-window__container__header">
                                        <h1>
                                            {headerText}
                                        </h1>
                                        <div className="modal-window__container__header__close">
                                            <IconButton 
                                                onClick={this.handleHide2FAModal}
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
                                    {this.renderModalBody()}
                                </div>
                            </div>
                        </CSSTransition>
                    </div>
                </div>
            </div>

        );
    }

    private handleNavigateTo2fa = () => {
        this.props.history.push('/security/twofa-authenticator', { enable2fa: true });
    };

    private getTableHeaders = () => {
        return (
            <tr>
                <th>{this.translate('page.body.profile.apiKeys.table.header.kid')}</th>
                <th>{this.translate('page.body.profile.apiKeys.table.header.algorithm')}</th>
                <th>{this.translate('page.body.profile.apiKeys.table.header.state')}</th>
                <th></th>
                <th className="right">{this.translate('page.body.profile.apiKeys.table.header.created')}</th>
                <th className="right">{this.translate('page.body.profile.apiKeys.table.header.updated')}</th>
                <th></th>
            </tr>
        );
    };

    private getTableData(apiKeysData: ApiKeyDataInterface[]) {
        return apiKeysData.map(item => (
            <tr>
                <td>{item.kid}</td>
                <td>{item.algorithm}</td>
                <td>
                    <div className="api-keys-screen__state">
                        <span
                            className={item.state === 'active' ? 'api-keys-screen__state__active'
                                : 'api-keys-screen__state__disabled'}
                        >
                            {item.state}
                        </span>
                    </div>
                </td>
                <td>
                    <div className="api-keys-screen__status">
                        <Form.Check
                            type="switch"
                            id={`apiKeyCheck-${item.kid}`}
                            label=""
                            onChange={this.handleToggleStateKeyClick(item)}
                            checked={item.state === 'active'}
                        />
                    </div>
                </td>
                <td className="right">
                    <div className="date-split">
                        <div className="date">{localeDate(item.created_at, 'date')}</div>
                        <div className="time">{localeDate(item.created_at, 'time')}</div>
                    </div>
                </td>
                <td className="right">
                    <div className="date-split">
                        <div className="date">{localeDate(item.updated_at, 'date')}</div>
                        <div className="time">{localeDate(item.updated_at, 'time')}</div>
                    </div>
                </td>
                <td className="right">
                    <DeleteIcon 
                        className="delete-icon"
                        onClick={() => this.handleDeleteKeyClick(item)}
                        key={item.kid}
                    />
                </td>
            </tr>
        ));
    } 

    private renderModalBody = () => {
        const {otpCode} = this.state;
        const { modal } = this.props;
        const secret = (modal && modal.apiKey) ? modal.apiKey.secret : '';
        let body;
        let button;
        const isDisabled = !otpCode.match(/.{6}/g);
        switch (this.props.modal.action) {
            case 'createKey':
                button = (
                        <Button
                            onClick={this.handleCreateKey}
                            disabled={isDisabled}
                            className="medium-button"
                        >
                            {this.translate('page.body.profile.apiKeys.modal.btn.create')}
                        </Button>
                    );
                break;
            case 'createSuccess':
                button = (
                        <Button
                            onClick={this.handleCreateSuccess}
                            className="medium-button"
                        >
                            {this.translate('page.body.profile.apiKeys.modal.btn.create')}
                        </Button>
                    );
                body = (
                    <div className="api-keys-screen__modal">
                        <div className="note-section">
                            {this.translate('page.body.profile.apiKeys.modal.note_content')}
                        </div>
                        <div className="api-keys-screen__modal__section">
                            <label className="relate">{this.translate('page.body.profile.apiKeys.modal.access_key')}</label>
                            <fieldset onClick={() => this.handleCopy('access-key-id', 'access')}>
                                <CopyableTextField
                                fieldId={'access-key-id'}
                                value={(modal.apiKey && modal.apiKey.kid) || ''}
                                />
                            </fieldset>
                        </div>
                        <div className="api-keys-screen__modal__section">
                            <label className="relate">{this.translate('page.body.profile.apiKeys.modal.secret_key')}</label>
                            <fieldset onClick={() => this.handleCopy('secret-key-id', 'secret')}>
                                <CopyableTextField
                                fieldId={'secret_key-id'}
                                value={secret || ''}
                                />
                            </fieldset>
                        </div>
                        <div className="warning-section">
                            {this.translate('page.body.profile.apiKeys.modal.secret_key_info')}
                        </div>
                        <div className="button-confirmation">
                            {button}
                        </div>
                    </div>
                );
                break;
            case 'updateKey':
                button = (
                    <Button
                        onClick={this.handleUpdateKey}
                        disabled={isDisabled}
                        className="medium-button"
                    >
                        {modal.apiKey && modal.apiKey.state === 'active' ?
                            this.translate('page.body.profile.apiKeys.modal.btn.disabled') :
                            this.translate('page.body.profile.apiKeys.modal.btn.activate')}
                    </Button>
                );
                break;
            case 'deleteKey':
                button =
                    (
                        <Button
                            onClick={this.handleDeleteKey}
                            disabled={isDisabled}
                            className="medium-button"
                        >
                            {this.translate('page.body.profile.apiKeys.modal.btn.delete')}
                        </Button>
                    );
                break;
            default:
                break;
        }
        body = !body ? (
            <div className="modal-delete" onKeyPress={this.handleEnterPress}> 
                <div className="twofa__form__content">
                    <div className="twofa__form__content__header">
                         {this.renderTitles2Fa()}
                    </div>
                    <div className="twofa__form__content__body">
                        <OtpInput
                            inputType="number"
                            value={otpCode}
                            onChange={this.handleOtpCodeChange}
                            numInputs={6}
                            renderSeparator={<span>-</span>}
                            shouldAutoFocus={true}
                            skipDefaultStyles={true}
                            inputStyle={{
                                caretColor: "var(--accent)"
                            }}
                            renderInput={(props) => <input {...props} />}
                        /> 
                    </div>
                    <div className="modal-window__container__footer">
                        {button}
                    </div>
                </div>
            </div>
        ) : body;

        return (
            <React.Fragment>
                {body}
            </React.Fragment>
        );
    };

    private handleHide2FAModal = () => {
        const payload: ApiKeys2FAModal['payload'] = {active: false};
        this.props.toggleApiKeys2FAModal(payload);
        this.setState({ otpCode: '', showModal: false });
    };

    private handleOtpCodeChange = (value: string) => {
        this.setState({
            otpCode: value,
        });
    };

    private renderOnClick = () => {
        switch (this.props.modal.action) {
            case 'createKey':
                this.handleCreateKey();
                break;
            case 'createSuccess':
                this.handleCreateSuccess();
                break;
            case 'updateKey':
                this.handleUpdateKey();
                break;
            case 'deleteKey':
                this.handleDeleteKey();
                break;
            default:
                break;
        }
    };

    private renderTitles2Fa = () => {
        switch (this.props.modal.action) {
            case 'createKey':
                return this.translate('page.body.profile.apiKeys.modal.btn.create.title');
            case 'createSuccess':
                return this.translate('page.body.profile.apiKeys.modal.btn.success.title');
            case 'updateKey':
                return this.translate('page.body.profile.apiKeys.modal.btn.update.title');
            case 'deleteKey':
                return this.translate('page.body.profile.apiKeys.modal.btn.delete.title');
            default:
                break;
        }
    };

    private handleEnterPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            this.renderOnClick();
        }
    };

    private handleCreateKeyClick = () => {
        const payload: ApiKeys2FAModal['payload'] = {active: true, action: 'createKey'};
        this.props.toggleApiKeys2FAModal(payload);
    };

    private handleCreateKey = () => {
        const payload: ApiKeyCreateFetch['payload'] = {totp_code: this.state.otpCode};
        this.props.createApiKey(payload);
        this.setState({otpCode: ''});
    };

    private handleCreateSuccess = () => {
        const payload: ApiKeys2FAModal['payload'] = {active: false};
        this.props.toggleApiKeys2FAModal(payload);
    };

    private handleToggleStateKeyClick = apiKey => () => {
        const payload: ApiKeys2FAModal['payload'] = {active: true, action: 'updateKey', apiKey};
        this.props.toggleApiKeys2FAModal(payload);
    };

    private handleUpdateKey = () => {
        const apiKey: ApiKeyDataInterface = {...this.props.modal.apiKey} as any;
        apiKey.state = apiKey.state === 'active' ? 'disabled' : 'active';
        const payload: ApiKeyUpdateFetch['payload'] = {totp_code: this.state.otpCode, apiKey: apiKey};
        this.props.updateApiKey(payload);
        this.setState({otpCode: ''});
    };

    private handleCopy = (id: string, type: string) => {
        this.copy(id);
        this.props.fetchSuccess({ message: [`success.api_keys.copied.${type}`], type: 'success'});
    };

    private handleDeleteKeyClick = apiKey => {
        const payload: ApiKeys2FAModal['payload'] = {active: true, action: 'deleteKey', apiKey};
        this.props.toggleApiKeys2FAModal(payload);
    };

    private handleDeleteKey = () => {
        const { modal } = this.props;
        const payload: ApiKeyDeleteFetch['payload'] = {kid: (modal.apiKey && modal.apiKey.kid) || '', totp_code: this.state.otpCode};
        this.props.deleteApiKey(payload);
        this.setState({otpCode: ''});
    };
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    apiKeys: selectApiKeys(state),
    dataLoaded: selectApiKeysDataLoaded(state),
    modal: selectApiKeysModal(state),
    user: selectUserInfo(state),
    pageIndex: selectApiKeysPageIndex(state),
    firstElemIndex: selectApiKeysFirstElemIndex(state, 4),
    lastElemIndex: selectApiKeysLastElemIndex(state, 4),
    nextPageExists: selectApiKeysNextPageExists(state),
    isMobile: selectMobileDeviceState(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        toggleApiKeys2FAModal: (payload: ApiKeys2FAModal['payload']) => dispatch(apiKeys2FAModal(payload)),
        apiKeysFetch: payload => dispatch(apiKeysFetch(payload)),
        createApiKey: payload => dispatch(apiKeyCreateFetch(payload)),
        updateApiKey: payload => dispatch(apiKeyUpdateFetch(payload)),
        deleteApiKey: payload => dispatch(apiKeyDeleteFetch(payload)),
        fetchSuccess: payload => dispatch(alertPush(payload)),
    });

export const ProfileApiKeys = injectIntl(connect(mapStateToProps, mapDispatchToProps)(ProfileApiKeysComponent)) as any;
