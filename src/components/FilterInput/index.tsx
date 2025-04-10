import classnames from 'classnames';
import * as React from 'react';
import { SearchFieldCloseIcon } from '../../assets/images/SearchFieldCloseIcon';
import { SearchIcon } from "../../assets/images/SearchIcon";

interface OnChangeEvent {
    target: {
        value: string;
    };
}

export interface FilterInputProps {
    data: object[];
    filter: (item: any, term: string) => boolean;
    onFilter?: (items: object[]) => void;
    className?: string;
    placeholder?: string;
    themes?: boolean;
}

export interface SearchInputState {
    key: string;
    focusedInput: boolean;
}

export class FilterInput extends React.Component<FilterInputProps, SearchInputState> {
    constructor(props: FilterInputProps) {
        super(props);
        this.state = {
            key: '',
            focusedInput: false,
        };
         
        this.filterList = this.filterList.bind(this);
    }
 
    public filterList(event?: OnChangeEvent) {
        const value = event ? event.target.value : '';
        const { data, filter, onFilter } = this.props;

        const result = data
            .filter(item => filter(item, value));

        onFilter && onFilter(result);
        this.setState({ key: value });
    }

 
    private handleInputFocus = () => {
      this.setState({ focusedInput: true });
    };

    private handleInputBlur = () => {
      this.setState({ focusedInput: false });
    };
    
    public render() {
        const { key } = this.state;
        const { className, placeholder, themes } = this.props;
        const cx = classnames('search-filter__input', className);
 
        const { focusedInput } = this.state;

        const focusedClass = classnames('search-filter', {
            'focused': focusedInput,
            'themes': themes,
        });

        return (
            <div className={focusedClass}>
                <span className="search-filter__icon">
                    <SearchIcon />
                </span>
                <input
                    type={'text'}
                    className={cx}
                    value={key}
                    placeholder={placeholder ? placeholder : 'Search'}
                    onChange={this.filterList}
                    onFocus={this.handleInputFocus}
                    onBlur={this.handleInputBlur}
                    spellCheck="false"
                />
                <span className="search-filter__cancel">
                    <SearchFieldCloseIcon onClick={e => this.filterList()} />
                </span>
            </div>
        );
    }
}
