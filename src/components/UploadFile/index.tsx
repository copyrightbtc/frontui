import classnames from 'classnames';
import React, { useCallback, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { TipIcon } from '../../assets/images/TipIcon';
import { changeElementPosition } from '../../helpers';

interface OwnPropsTranslations {
    title?: string;
    label?: string;
    buttonText?: string;
    sizesText?: string;
    formatsText?: string;
    tipText?: string;
    isMobileDevice?: boolean;
    fileSizeErrorMessage?: string;
    sizeMessage?: string;
}

interface OwnProps extends OwnPropsTranslations {
    handleUploadScan: (e: any) => void;
    id?: string;
    exampleImagePath?: string;
    uploadedFile?: string;
    accept?: string; 
}

type Props = OwnProps;

const UploadFileComponent: React.FC<Props> = ({
    title,
    label, 
    sizesText,
    formatsText,
    tipText,
    exampleImagePath,
    id,
    isMobileDevice,
    uploadedFile,
    fileSizeErrorMessage,
    sizeMessage,
    handleUploadScan,
    accept = 'application/pdf,image/jpg,image/jpeg,image/png,image/heic', 
}) => {
    const [isMouseTooltipVisible, setIsMouseTooltipVisible] = useState<boolean>(false);

    const [selectedFile, setSelectedFile] = useState();
    const [preview, setPreview] = useState<string>();

    const handleToggleTooltipVisible = useCallback(() => {
        setIsMouseTooltipVisible((prevState) => !prevState);
    }, []);
 
    const handleHoverTooltipIcon = useCallback(() => {
        changeElementPosition('upload-file__tooltip', 0, -100, 20);
        handleToggleTooltipVisible();
    }, [handleToggleTooltipVisible]);

    const renderTitle = useCallback(() => {
        return (
            <div className="upload-file__content__title">
                {tipText ? (
                    <div
                        className="upload-file__content__title__tip-icon"
                        onMouseEnter={handleHoverTooltipIcon}
                        onMouseLeave={handleToggleTooltipVisible}>
                        <TipIcon />
                    </div>
                ) : null}
                {title ? <h3>{title}</h3> : null}
            </div>
        );
    }, [handleHoverTooltipIcon, handleToggleTooltipVisible, tipText, title]);
 
    // create a preview as a side effect, whenever selected file is changed
    React.useEffect(() => {
        if (!selectedFile) {
            setPreview(undefined);
            return;
        };

        const objectUrl = URL.createObjectURL(selectedFile);
        setPreview(objectUrl);

        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl);
    }, [selectedFile]);

    const handleUploadImage = e => {
        if (!e.target.files || e.target.files.length === 0) {
            setSelectedFile(undefined); 
            return;
        }

        // I've kept this example simple by using the first image instead of multiple
        setSelectedFile(e.target.files[0]);
        handleUploadScan(e);
    };

    const classMain = classnames('upload-file__content__form', {
        'upload-file__content__form--notuploaded': !selectedFile,
    });

    const buttonUploaded = classnames('upload-file__content__form__info__button', {
        'upload-file__content__form__info__button--notuploaded': !selectedFile,
    });
 
  
    return (
        <div className="upload-file">
            <div className="upload-file__content">
                {tipText || title ? renderTitle() : null}
                {label ? <label>{label}</label> : null}
                <div className={classMain}>
                    <input
                        accept={accept}
                        className="upload-file__content__form__input"
                        data-multiple-caption="files selected"
                        draggable={true}
                        multiple={false}
                        name="files[]"
                        type="file"
                        id={id || 'file'}
                        onChange={handleUploadImage}
                    />
                    <div className="upload-file__content__form__info">
                        {exampleImagePath && isMobileDevice ? (
                            <div className="upload-file__doc-image">
                                <img src={exampleImagePath} alt={`${label} example`} />
                            </div>
                        ) : null}
                        <React.Fragment> 
                            <span className={buttonUploaded}>
                                {!selectedFile ? <FormattedMessage id="page.body.kyc.documents.uploadFile.selfie.button" /> : 
                                <FormattedMessage id="page.body.kyc.documents.uploadFile.selfie.button.change" />}
                            </span> 
                            {sizesText ? (
                                <span className="upload-file__content__form__info__text">{sizesText}</span>
                            ) : null}
                            {formatsText ? (
                                <span className="upload-file__content__form__info__text">{formatsText}</span>
                            ) : null} 
                            {selectedFile &&  <span className="upload-file__content__form__info__img"><img alt="preview" src={preview} /></span>  }
                        </React.Fragment> 
                    </div> 
                </div>
 
            </div>
            {exampleImagePath && !isMobileDevice ? (
                <div className="upload-file__doc-image">
                    <img src={exampleImagePath} alt={`${label} example`} />
                </div>
            ) : null}
            {tipText ? (
                <span
                    className={classnames('upload-file__tooltip tooltip-hover', {
                        'tooltip-hover--visible': isMouseTooltipVisible,
                    })}>
                    <FormattedMessage id={tipText} />
                </span>
            ) : null}
            {uploadedFile ? (
                <span className="upload-file__content__form__info__text__file">
                    <FormattedMessage id={'page.body.kyc.uploadFile.error.name'} />
                    {uploadedFile}
                </span>
            ) : null}
            {fileSizeErrorMessage ? (
                <span className="upload-file__content__form__info__text__error">{fileSizeErrorMessage}</span>
            ) : <span className="upload-file__content__form__info__text__file">{sizeMessage}</span> }
        </div>
    );
};

export const UploadFile = React.memo(UploadFileComponent);
