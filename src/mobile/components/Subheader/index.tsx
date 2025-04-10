import * as React from 'react';
import { ArrowIcon } from '../../../containers/ToolBar/icons/ArrowIcon';

interface Props {
    rightElement?: React.ReactElement;
    backTitle?: string;
    title: string;
    onGoBack: () => void;
    close?: boolean;
}

const SubheaderComponent = ({rightElement, backTitle, title, onGoBack, close = true}: Props) => {
    return (
        <div className="cr-mobile-subheader">
            <div className="cr-mobile-subheader__back" onClick={onGoBack}>
                <ArrowIcon />
                <span className="cr-mobile-subheader__back-item">{backTitle}</span>
            </div>
            <div className="cr-mobile-subheader__title">
                {title}
            </div>
            <div className="cr-mobile-subheader__close"/>
            {close && <div className="cr-mobile-subheader__close"/>}
            {rightElement || null}
        </div>
    );
};

const Subheader = React.memo(SubheaderComponent);

export {
    Subheader,
};
