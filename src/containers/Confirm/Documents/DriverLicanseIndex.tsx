import cr from 'classnames';
import * as countries from 'i18n-iso-countries';
import * as React from 'react';
import { Button, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { ArrowDownward } from 'src/assets/images/ArrowDownward';
import { injectIntl } from 'react-intl';
import MaskInput from 'react-maskinput';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { RouterProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { authsforUploadSizeMaxRange, authsforUploadSizeMinRange, languages } from '../../../api/config';
import { compose } from 'redux';
import { IntlProps } from '../../../'; 
import { CustomInput, UploadFile } from '../../../components';
import { formatDate, isDateInFuture, randomSecureHex } from '../../../helpers';
 
import {
    alertPush,
    RootState,
    selectCurrentLanguage,
    selectMobileDeviceState,
    selectSendDocumentsSuccess,
    sendDocuments,
} from '../../../modules';

interface ReduxProps {
    lang: string;
    success?: boolean;
    isMobileDevice: boolean;
}

interface DispatchProps {
    sendDocuments: typeof sendDocuments;
    fetchAlert: typeof alertPush;
}

interface OnChangeEvent {
    target: {
        value: string;
    };
}

interface DocumentsState {
    issuedDate: string;
    issuedDateFocused: boolean;
    expireDate: string;
    expireDateFocused: boolean;
    idNumber: string;
    idNumberFocused: boolean;
    fileFront: File[];
    fileBack: File[];
    fileSelfie: File[]; 
    frontsizeMessage: string;
    backsizeMessage: string;
    selfiesizeMessage: string;
    frontFileSizeErrorMessage: string;
    backFileSizeErrorMessage: string;
    selfieFileSizeErrorMessage: string;
}

type Props = ReduxProps & DispatchProps & RouterProps & IntlProps;

class DocumentsComponent extends React.Component<Props, DocumentsState> {
 
    public translate = (key: string, value?: string, min?: string) => this.props.intl.formatMessage({ id: key }, {value, min});

    public state = {
        issuedDate: '',
        issuedDateFocused: false,
        expireDate: '',
        expireDateFocused: false,
        idNumber: '',
        idNumberFocused: false,
        fileFront: [],
        fileBack: [],
        fileSelfie: [],
        frontsizeMessage: '', 
        backsizeMessage: '', 
        selfiesizeMessage: '', 
        frontFileSizeErrorMessage: '', 
        backFileSizeErrorMessage: '',
        selfieFileSizeErrorMessage: '',
    };

    public UNSAFE_componentWillReceiveProps(next: Props) {
        if (next.success && !this.props.success) {
            this.props.history.push('/profile');
        }
        if (next.success && !this.props.success && this.props.isMobileDevice) {
            this.props.history.push('/profile/verification');
        }
    }
    public data = [
        this.translate('page.body.kyc.documents.select.passport'),
        this.translate('page.body.kyc.documents.select.identityCard'),
        this.translate('page.body.kyc.documents.select.driverLicense'),
    ];
     
    public render() {
        const { isMobileDevice } = this.props;
        const {
            fileFront,
            fileBack,
            fileSelfie,
            issuedDate,
            issuedDateFocused,
            expireDate,
            expireDateFocused,
            idNumber,
            idNumberFocused,
            frontsizeMessage,
            backsizeMessage,
            selfiesizeMessage,
            frontFileSizeErrorMessage,
            backFileSizeErrorMessage,
            selfieFileSizeErrorMessage,
        }: DocumentsState = this.state;

        
        languages.map((l: string) => countries.registerLocale(require(`i18n-iso-countries/langs/${l}.json`)));
        

        const issuedDateFocusedClass = cr('verification-modal__content__group', {
            'verification-modal__content__group--focused': issuedDateFocused,
            'verification-modal__content__group--wrong': issuedDate && !this.handleValidateInput('issuedDate', issuedDate),
        });

        const expireDateFocusedClass = cr('verification-modal__content__group', {
            'verification-modal__content__group--focused': expireDateFocused,
            'verification-modal__content__group--wrong': expireDate && !this.handleValidateInput('expireDate', expireDate),
        });

        const idNumberFocusedClass = cr('verification-modal__content__group', {
            'verification-modal__content__group--focused': idNumberFocused,
            'verification-modal__content__group--wrong': idNumber && !this.handleValidateInput('idNumber', idNumber),
        });
 
        return (
            <React.Fragment>
                <div className="documents-verifying"> 
                    <div className="documents-verifying__title">
                        <h6>{this.translate('page.body.kyc.documents.select.driver.title')}</h6>
                        <h6>{this.translate('page.body.kyc.documents.select.text1')}</h6>
                    </div>
                    <div className="documents-verifying__column">
                        <div className="row">
                            <fieldset className={idNumberFocusedClass}>
                                <label className="relate">{this.translate('page.body.kyc.documents.driver')}</label>
                                <CustomInput
                                    type="string"
                                    placeholder={this.translate('page.body.kyc.documents.idNumber.placeholder')}
                                    inputValue={idNumber}
                                    handleChangeInput={this.handleChangeIdNumber}
                                    handleFocusInput={this.handleFieldFocus('idNumber')}
                                />
                            </fieldset>
                        </div> 
                        <div className="row two">
                            <fieldset className={issuedDateFocusedClass}> 
                                <label className="relate">{this.translate('page.body.kyc.documents.issuedDate')}</label>
                                <div className="input-group short">
                                    <MaskInput
                                        maskString="00/00/0000"
                                        mask="00/00/0000"
                                        onChange={this.handleChangeIssuedDate}
                                        onFocus={this.handleFieldFocus('issuedDate')}
                                        onBlur={this.handleFieldFocus('issuedDate')}
                                        value={issuedDate}
                                        className="group-input"
                                        placeholder={this.translate('page.body.kyc.documents.date.placeholder')}
                                    />
                                </div> 
                            </fieldset>
                            <fieldset className={expireDateFocusedClass}>
                                <label className="relate">{this.translate('page.body.kyc.documents.expiryDate')}</label>
                                <div className="input-group short">
                                    <MaskInput
                                        maskString="00/00/0000"
                                        mask="00/00/0000"
                                        onChange={this.handleChangeExpiration}
                                        onFocus={this.handleFieldFocus('expireDate')}
                                        onBlur={this.handleFieldFocus('expireDate')}
                                        value={expireDate}
                                        className="group-input"
                                        placeholder={this.translate('page.body.kyc.documents.date.placeholder')}
                                    />
                                </div>
                            </fieldset>
                        </div>
                    </div>
                    <h6>{this.translate('page.body.kyc.documents.select.upload.driver')}</h6>
                    <div className="documents-verifying__main-wrapper__right"> 
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ArrowDownward className='arrow-exp'/>}
                                aria-controls="panel1-content"
                                id="panel1-header"
                            >
                            <span>{this.translate('page.body.kyc.documents.select.uploadphoto.title')}</span>
                            </AccordionSummary>
                            <AccordionDetails>
                                <ul>
                                    <li>{this.translate('page.body.kyc.documents.select.text2')}</li>
                                    <li>{this.translate('page.body.kyc.documents.select.text3')}</li>
                                    <li>{this.translate('page.body.kyc.documents.select.text4')}</li>
                                    <li>{this.translate('page.body.kyc.documents.select.uploadphoto.text1')}</li>
                                    <li>{this.translate('page.body.kyc.documents.select.uploadphoto.text2')}</li>
                                    <li>{this.translate('page.body.kyc.documents.select.uploadphoto.text3')}</li>
                                    <li>{this.translate('page.body.kyc.documents.select.uploadphoto.text4')}</li>
                                    <li>{this.translate('page.body.kyc.documents.select.uploadphoto.text5')}</li>
                                    <li>{this.translate('page.body.kyc.documents.select.uploadphoto.text6')}</li>
                                    <li>{this.translate('page.body.kyc.documents.select.uploadphoto.text7')}</li>
                                    <li>{this.translate('page.body.kyc.documents.select.uploadphoto.text8')}</li>
                                </ul>
                            </AccordionDetails>
                        </Accordion>
                    </div>                       
                    <div className="documents-verifying__main-wrapper">
                        <div className="documents-verifying__main-wrapper__left">
                            <div className="upload-file__wrapper">
                                <div className="upload-file__title">
                                    {this.translate('page.body.kyc.documents.uploadFile.front.driverLicense.title')}
                                </div>
                                
                                <UploadFile
                                    sizesText={this.translate('page.body.kyc.documents.uploadFile.front.sizes')}
                                    isMobileDevice={isMobileDevice}
                                    id="fileFront"
                                    handleUploadScan={uploadEvent => this.handleUploadScan(uploadEvent, 'front')} 
                                    uploadedFile={fileFront[0] && (fileFront[0] as File).name}
                                    fileSizeErrorMessage={frontFileSizeErrorMessage} 
                                    sizeMessage={frontsizeMessage}
                                />
                            </div>
                            <div className="upload-file__wrapper">
                                <div className="upload-file__title">
                                    {this.translate('page.body.kyc.documents.uploadFile.back.driverLicense.title')}
                                </div>                               
                                <UploadFile
                                    isMobileDevice={isMobileDevice}
                                    id="fileBack" 
                                    sizesText={this.translate('page.body.kyc.documents.uploadFile.front.sizes')}
                                    handleUploadScan={uploadEvent => this.handleUploadScan(uploadEvent, 'back')} 
                                    uploadedFile={fileBack[0] && (fileBack[0] as File).name}
                                    fileSizeErrorMessage={backFileSizeErrorMessage}
                                    sizeMessage={backsizeMessage}
                                />
                            </div>  
                            <div className="upload-file__wrapper">
                                <div className="upload-file__title">
                                    {this.translate('page.body.kyc.documents.uploadFile.selfie.driverLicense.title')}
                                </div>  
                                <UploadFile
                                    isMobileDevice={isMobileDevice}
                                    id="fileSelfie" 
                                    sizesText={this.translate('page.body.kyc.documents.uploadFile.front.sizes')}
                                    handleUploadScan={uploadEvent => this.handleUploadScan(uploadEvent, 'selfie')} 
                                    uploadedFile={fileSelfie[0] && (fileSelfie[0] as File).name}
                                    fileSizeErrorMessage={selfieFileSizeErrorMessage}
                                    sizeMessage={selfiesizeMessage}
                                /> 
                            </div>
                        </div>
                    </div>
                    <div className="modal-window__container__footer">
                        <Button
                            onClick={this.sendDocuments}
                            className="medium-button"
                            disabled={this.handleCheckButtonDisabled()}
                        >
                            {this.translate('page.body.kyc.submit')}
                        </Button>
                    </div>
                </div>
            </React.Fragment>
        );
    }

    private handleChangeIdNumber = (value: string) => {
        this.setState({
            idNumber: value,
        });
    };

    private handleFieldFocus = (field: string) => {
        return () => {
            switch (field) {
                case 'issuedDate':
                    this.setState({
                        issuedDateFocused: !this.state.issuedDateFocused,
                    });
                    break;
                case 'expireDate':
                    this.setState({
                        expireDateFocused: !this.state.expireDateFocused,
                    });
                    break;
                case 'idNumber':
                    this.setState({
                        idNumberFocused: !this.state.idNumberFocused,
                    });
                    break;
                default:
                    break;
            }
        };
    };

    private handleChangeIssuedDate = (e: OnChangeEvent) => {
        this.setState({
            issuedDate: formatDate(e.target.value),
        });
    };

    private handleChangeExpiration = (e: OnChangeEvent) => {
        this.setState({
            expireDate: formatDate(e.target.value),
        });
    };

    private handleUploadScan = (uploadEvent, id) => {
        const allFiles: File[] = uploadEvent.target.files;
        const maxDocsCount = 1;
        const additionalFileList = Array.from(allFiles).length > maxDocsCount ?  Array.from(allFiles).slice(0, maxDocsCount) : Array.from(allFiles);

        if (!additionalFileList.length) {
            return;
        }
 
        const sizeKB = (additionalFileList[0].size / 1048576 ).toFixed(3);

        switch (id) {
            case 'front':
                if (additionalFileList[0].size > authsforUploadSizeMaxRange * 1024 * 1024) {
                    this.setState({ frontFileSizeErrorMessage: this.translate('page.body.kyc.uploadFile.error.tooBig', sizeKB) });
                } else if (additionalFileList[0].size < authsforUploadSizeMinRange * 1024 * 1024) {
                    this.setState({ frontFileSizeErrorMessage: this.translate('page.body.kyc.uploadFile.error.tooSmall', sizeKB) });
                } else {
                    this.setState({ frontsizeMessage: this.translate('page.body.kyc.uploadFile.error.normal', sizeKB) });
                }

                this.setState({ fileFront: additionalFileList });
                break;
            case 'back':
                if (additionalFileList[0].size > authsforUploadSizeMaxRange * 1024 * 1024) {
                    this.setState({ backFileSizeErrorMessage: this.translate('page.body.kyc.uploadFile.error.tooBig', sizeKB) });
                } else if (additionalFileList[0].size < authsforUploadSizeMinRange * 1024 * 1024) {
                    this.setState({ backFileSizeErrorMessage: this.translate('page.body.kyc.uploadFile.error.tooSmall', sizeKB) });
                } else {
                    this.setState({ backsizeMessage: this.translate('page.body.kyc.uploadFile.error.normal', sizeKB) });
                }

                this.setState({ fileBack: additionalFileList});
                break;
            case 'selfie':
                if (additionalFileList[0].size > authsforUploadSizeMaxRange * 1024 * 1024) {
                    this.setState({ selfieFileSizeErrorMessage: this.translate('page.body.kyc.uploadFile.error.tooBig', sizeKB) });
                } else if (additionalFileList[0].size < authsforUploadSizeMinRange * 1024 * 1024) {
                    this.setState({ selfieFileSizeErrorMessage: this.translate('page.body.kyc.uploadFile.error.tooSmall', sizeKB) });
                } else {
                    this.setState({ selfiesizeMessage: this.translate('page.body.kyc.uploadFile.error.normal', sizeKB) });
                }

                this.setState({ fileSelfie: additionalFileList });
                break;
            default:
                break;
        }
    };

    private handleValidateInput = (field: string, value: string): boolean => {
        switch (field) {
            case 'issuedDate':
                return !isDateInFuture(value);
            case 'expireDate':
                return isDateInFuture(value);
            case 'idNumber':
                const cityRegex = new RegExp(`^[a-zA-Z0-9]+$`);

                return value.match(cityRegex) ? true : false;
            default:
                return true;
        }
    };

    private handleCheckButtonDisabled = () => {
        const {
            issuedDate,
            expireDate,
            fileBack,
            fileFront,
            fileSelfie,
            idNumber,
            frontFileSizeErrorMessage,
            backFileSizeErrorMessage,
            selfieFileSizeErrorMessage,
        } = this.state;

        const filesValid = (
                fileSelfie.length && 
                fileFront.length && fileBack.length && 
                frontFileSizeErrorMessage === '' && 
                backFileSizeErrorMessage === '' && 
                selfieFileSizeErrorMessage === ''
            );
 
        return (
            !this.handleValidateInput('idNumber', idNumber) ||
            !this.handleValidateInput('issuedDate', issuedDate) ||
            (expireDate && !this.handleValidateInput('expireDate', expireDate)) ||
            !filesValid
        );
    };

    private sendDocuments = () => {
        const {
            fileBack,
            fileFront,
            fileSelfie,
        } = this.state;
        const identificator = randomSecureHex(32);

        if (this.handleCheckButtonDisabled()) {
            return;
        };

        const payload = {
            front_side: this.createFormData('front_side', fileFront, identificator),
            back_side: this.createFormData('back_side', fileBack, identificator),
            selfie: this.createFormData('selfie', fileSelfie, identificator),
        };

        this.props.sendDocuments(payload);
    };
 
    private createFormData = (docCategory: string, upload: File[], identificator: string) => {
        const {
            expireDate,
            issuedDate,
            idNumber,
        }: DocumentsState = this.state;

        const request = new FormData();

        if (expireDate) {
            request.append('doc_expire', expireDate);
        }

        request.append('doc_issue', issuedDate);
        request.append('doc_type', 'Driver license');
        request.append('doc_number', idNumber);
        request.append('identificator', identificator);
        request.append('doc_category', docCategory);
        request.append('upload[]', upload[0]);

        return request;
    }; 
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    lang: selectCurrentLanguage(state),
    success: selectSendDocumentsSuccess(state),
    isMobileDevice: selectMobileDeviceState(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        fetchAlert: payload => dispatch(alertPush(payload)),
        sendDocuments: payload => dispatch(sendDocuments(payload)),
    });

export const DriverLicanseIndex = compose(
    injectIntl,
    withRouter,
    connect(mapStateToProps, mapDispatchToProps),
)(DocumentsComponent) as any; 
