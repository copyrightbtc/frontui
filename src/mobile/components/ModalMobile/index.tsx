import classnames from 'classnames';
import * as React from 'react';

const ModalComponent = props => {
    const [shouldOpen, setShouldOpen] = React.useState(false);

    React.useEffect(() => {
        if (props.isOpen) {
            setTimeout(() => {
                setShouldOpen(true);
            }, 200);
        }

        return () => setShouldOpen(false);
    }, [props.isOpen]);

    const handleOnClose = (event, strictTarget?: boolean) => {
        if (event) {
            event.preventDefault();

            if (strictTarget && event.target !== event.currentTarget) {
                return;
            }

            setShouldOpen(false);

            setTimeout(() => {
                props.onClose && props.onClose();
            }, 200);
            
        }
    };

    const modalClassName = classnames('mobile-modal', {
        'mobile-modal--open': shouldOpen,
        'mobile-modal--close': !shouldOpen,
    });
    const bodyClassName = classnames('mobile-modal__block', {
        'mobile-modal__block--open': shouldOpen,
        'mobile-modal__block--close': !shouldOpen,
    }, props.classNames);

    return (
        <div className={modalClassName} onClick={e => handleOnClose(e, true)}>
            <div className={bodyClassName}>
                {props.header}
                <div className="mobile-modal__body" onClick={e => e.stopPropagation()}>
                    {props.children}
                </div>
            </div>
        </div>
    );
};

export const ModalMobile = React.memo(ModalComponent);
