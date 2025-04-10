import * as React from 'react';

interface Props {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onlyNextPrev?: boolean;
    isEndOfData?: boolean;
}

interface ChangePageIconProps {
    disabled?: boolean;
}
const PreviousIcon: React.FunctionComponent<ChangePageIconProps> = ({ disabled }) => {
    return (
        <svg width="22" height="24" viewBox="0 0 22 24" fill="#878D9A" xmlns="http://www.w3.org/2000/svg">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M14.0545 7.4L12.7782 6L7.30853 12L12.7782 18L14.0545 16.6L9.86105 12L14.0545 7.4Z"
                fill={`${disabled ? 'var(--pagination-disabled)' : 'var(--pagination-active)'}`}
                fillOpacity={`${disabled ? '0.5' : ''}`}
            />
        </svg>
    );
};

const NextPageIcon: React.FunctionComponent<ChangePageIconProps> = ({ disabled }) => {
    return (
        <svg width="23" height="24" viewBox="0 0 23 24" fill="#878D9A" xmlns="http://www.w3.org/2000/svg">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8.61279 7.4L9.88905 6L15.3587 12L9.88905 18L8.61279 16.6L12.8062 12L8.61279 7.4Z"
                fill={`${disabled ? 'var(--pagination-disabled)' : 'var(--pagination-active)'}`}
                fillOpacity={`${disabled ? '0.5' : ''}`}
            />
        </svg>
    );
};

const Pagination = ({ currentPage, totalPages, onPageChange, onlyNextPrev, isEndOfData }: Props) => {


    const pages = React.useMemo((): (number | null)[] => {
        if (onlyNextPrev) {
            return [currentPage];
        }

        if (totalPages <= 5) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        if (currentPage <= 4) {
            return [1, 2, 3, 4, 5, null, totalPages];
        }

        if (currentPage >= totalPages - 3) {
            return [1, null, totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
        }

        return [1, null, currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2, null, totalPages];
    }, [currentPage, totalPages]);


    return (
        <div className="pagination flex items-center justify-center gap-1">
            <button
                className="pagination__button"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                <PreviousIcon disabled={currentPage === 1} />
            </button>
            {pages.map((page, index) => page === null ? <p key={index} className="text-gray-300">...</p> : (
                <button
                    key={index}
                    className={`pagination__button ${currentPage === page ? 'active' : ''}`}
                    onClick={() => !onlyNextPrev && onPageChange(page)}
                >
                    {page}
                </button>
            ))}
            <button
                className="pagination__button"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={onlyNextPrev ? isEndOfData : currentPage === totalPages}
            >
                <NextPageIcon disabled={onlyNextPrev ? isEndOfData : currentPage === totalPages} />
            </button>
        </div>
    );
};

export default Pagination;