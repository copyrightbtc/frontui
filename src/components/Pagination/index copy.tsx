import * as React from 'react';
interface PaginationProps {
    firstElemIndex: number;
    lastElemIndex: number;
    onClickPrevPage: () => void;
    onClickNextPage: () => void;
    onPageChange?: (page: number) => void;
    page: number;
    paginationLim?: number;
    nextPageExists: boolean;
    total?: number;
    counts?: boolean;
    separator?: string;
    totalText?: string;
}


interface ChangePageIconProps {
    disabled: boolean;
}

const PreviousIcon: React.FunctionComponent<ChangePageIconProps> = ({ disabled }) => {
    return (
        <svg width="22" height="24" viewBox="0 0 22 24" fill="#878D9A" xmlns="http://www.w3.org/2000/svg"
            className={`${disabled ? 'disabled' : 'active'}`}
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M14.0545 7.4L12.7782 6L7.30853 12L12.7782 18L14.0545 16.6L9.86105 12L14.0545 7.4Z"
                fillOpacity={`${disabled ? '0.5' : ''}`}
            />
        </svg>
    );
};


const NextPageIcon: React.FunctionComponent<ChangePageIconProps> = ({ disabled }) => {
    return (
        <svg width="23" height="24" viewBox="0 0 23 24" fill="#878D9A" xmlns="http://www.w3.org/2000/svg"
            className={`${disabled ? 'disabled' : 'active'}`}
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8.61279 7.4L9.88905 6L15.3587 12L9.88905 18L8.61279 16.6L12.8062 12L8.61279 7.4Z"
                fillOpacity={`${disabled ? '0.5' : ''}`}
            />
        </svg>
    );
};
export const Pagination = ({
    firstElemIndex,
    lastElemIndex,
    onClickPrevPage,
    onClickNextPage,
    page,
    nextPageExists,
    paginationLim,
    total,
    counts,
    separator,
    totalText,
    onPageChange,
 }: PaginationProps) => {
 
    const prevDisabled = page === 0;
    const nextDisabled = !nextPageExists;

    const totalPages = total * paginationLim;

    const onClickPrevPages = () => {
        if (page === 0) {
            return;
        }
        onClickPrevPage();
    };

    const onClickNextPages = () => {
        if (!nextPageExists) {
            return;
        }
        onClickNextPage();
    };

    const renderInfoElement = () => {
 
        if (total) {
            return (
                <div className="pagination-element__pages">
                    <span>{firstElemIndex}</span>
                    <span>{separator || ' - '}</span>
                    <span>{lastElemIndex}</span>
                    <span>{totalText || ' of '}</span>
                    <span>{total}</span>
                </div>
            );
        }

        return (
            <div className="pagination-element__pages">
                <span>{firstElemIndex}</span>
                <span>{separator || ' - '}</span>
                <span>{lastElemIndex}</span>
            </div>
        );
    };

 

    return (
        <div className="pagination-element">
            {renderInfoElement()}
            <button
                className="prev"
                onClick={onClickPrevPages}
                disabled={prevDisabled}
            >
                <PreviousIcon disabled={prevDisabled}/>
            </button> 
            <button
                className="next"
                onClick={onClickNextPages}
                disabled={nextDisabled}
            >
                <NextPageIcon disabled={nextDisabled}/>
            </button>
        </div>
    );
};