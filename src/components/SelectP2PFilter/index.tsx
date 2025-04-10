import React, { ReactNode } from 'react';
import onClickOutside from "react-onclickoutside";
import Checkbox from "./Checkbox";
import { RootState, selectMobileDeviceState } from "../../modules";
import { connect } from "react-redux";
import Input from "./Input";
import { ArrowIconFilled } from "../../assets/images/ArrowIconFilled";
import { SearchIcon } from "../../assets/images/SearchIcon";

type UnstableProp = {
    multiple?: undefined;
    onChange: (value: string) => void;
    value?: string;
} | {
    multiple: true;
    onChange: (value: string[]) => void;
    value?: string[];
}

type ReduxProps = {
    isMobileDevice?: boolean;
}

type SelectP2PFilterOption = {
    label: string;
    value: string;
    icon?: JSX.Element;
}

export type SelectP2PFilterProps = {
    isActionList?: boolean;
    searchAble?: boolean;
    searchPlaceholder?: string;
    options: SelectP2PFilterOption[];
    placeholder?: string;
    customTitle?(option: SelectP2PFilterOption | SelectP2PFilterOption[]): string;
    inline?: boolean;
    fixedWidth?: number;
    error?: string;
    suffixMarkup?: ReactNode,
    currentIcon?: ReactNode,
} & UnstableProp & ReduxProps;


type State = {
    isOpen: boolean;
    query?: string;
    intl?: string;
}

class SelectP2PFilterComponent extends React.Component<SelectP2PFilterProps> {

    public state: State = {
        isOpen: false,
    }
    private rootRef = React.createRef<HTMLDivElement>();
    private panelRef = React.createRef<HTMLDivElement>();

    private handleClick = () => {
        this.setState({ isOpen: !this.state.isOpen, query: "" });
    }

    public handleClose = () => {
        this.setState({ isOpen: false, query: "" });
    }

    private handleChange = (_value: string) => {
        const { multiple, value, onChange } = this.props;
        if (multiple) {
            const newValue: string[] = (value as string[]) ?? [];
            const index = value?.indexOf(_value) ?? -1;
            if (index > -1) {
                newValue.splice(index, 1);
            } else {
                newValue.push(_value);
            }
            (onChange as (value: string[]) => void)(newValue);
        } else {
            (onChange as (value: string) => void)(_value);
        }
        if (!multiple) {
            this.setState({ isOpen: false });
        }
    }

    private generateTitle = () => {
        const { multiple, value, options, placeholder, customTitle } = this.props;
        let title = "";
        if (!value || !value.length) return placeholder;
        if (multiple) {
            if (customTitle) {
                const optionSelected = options.filter((option) => value.includes(option.value));
                return customTitle(optionSelected);
            }
            if (value.length === options.length) {
                title = "All selected";
            } else {
                title = `${value.length} selected`;
            }
        } else {
            const optionSelected = options.find((option) => value.includes(option.value));
            if (customTitle && optionSelected) {
                return customTitle(optionSelected);
            }
            title = options.find(option => option.value === value)?.label ?? "";
        }
        return title;
    }

    private renderQuery = () => {
        const { query } = this.state;
        const { searchPlaceholder, } = this.props;

        const handleChangeQuery = (query: string) => {
            this.setState({ query });
        }

        return (
            <div className="select-dropdown__search">
                <Input 
                    placeholder={searchPlaceholder ? searchPlaceholder : "Search"} 
                    value={query} 
                    onChange={handleChangeQuery}
                    suffix={<SearchIcon />}
                />
            </div>
        );
    } 

    private renderDesktop() {
        const { options, value, multiple, inline, fixedWidth, searchAble, error, isActionList, suffixMarkup, currentIcon } = this.props;
        const { query } = this.state;

        const selected = options.filter(option => multiple ? value?.includes(option.value) : option.value === value);

        const optionsFiltered = query ? options.filter(option => option.label.toLowerCase().includes(query.toLowerCase())) : options; 
        return (
            <div
                onClick={this.handleClick}
                ref={this.rootRef}
                style={{ minWidth: fixedWidth ? `${fixedWidth}px` : undefined, width: fixedWidth ? `${fixedWidth}px` : undefined }}
                className={`select-dropdown${this.state.isOpen ? " select-dropdown__active" : ""}${inline ? " active-border" : ""}${error ? " error" : ""}`}
            >
                <div className="select-dropdown__container">
                    <div className="select-dropdown__container__suffix"> 
                        {suffixMarkup}
                    </div>
                    <div className="select-dropdown__container__values">
                        {isActionList ? (
                            <span className={`select__value`}>{currentIcon}{this.generateTitle()}</span>
                        ) : (
                            <span className={`select__value${selected.length ? "" : " select__placeholder"}${inline ? " inline" : ""}`}>{currentIcon}{this.generateTitle()}</span>
                        )}
                        <ArrowIconFilled className={`select__icon ${this.state.isOpen ? "active" : ""}`} />
                    </div>
                </div>
                {this.state.isOpen && (
                    <div ref={this.panelRef} onClick={e => e.stopPropagation()} className="select-dropdown__menu">
                        {searchAble && this.renderQuery()}
                        <div className='select-dropdown__menu__body'>
                            {optionsFiltered.length ? optionsFiltered.map((option, index) => (
                                <div
                                    key={`${option.value}_${index}`}
                                    className={`select-dropdown__menu__option${option.value === value ? " active" : ""} ${isActionList ? 'action-item' : ''}`}
                                    onClick={() => this.handleChange(option.value)}
                                >
                                    {multiple ? (
                                        <Checkbox
                                            label={option.label}
                                            checked={value?.includes(option.value) ? true : false}
                                            onChange={() => this.handleChange(option.value)}
                                        />
                                    ) : (
                                        <div className='select-dropdown__menu__option__label'>{option.icon}{option.label}</div>
                                    )}

                                </div>
                            )) : (
                                <div className="select-dropdown__menu__option">
                                    <span className="empty">Empty results</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        )
    }

    private renderMobile = () => {
        const { options, value, multiple, inline, searchAble, error } = this.props;
        const { query } = this.state;
        const selected = options.filter(option => multiple ? value?.includes(option.value) : option.value === value);

        const optionsFiltered = query ? options.filter(option => option.label.toLowerCase().includes(query.toLowerCase())) : options;

        return (
            <div
                onClick={this.handleClick}
                ref={this.rootRef}
                className={`select ${this.state.isOpen ? " active" : ""}${inline ? " inline-style" : ""}${error ? " error" : ""}`}
            >
                <div className="flex items-center justify-between gap-3 w-full">
                    <span className={`select__value${selected.length ? "" : " select__placeholder"}${inline ? " inline" : ""}`}>{this.generateTitle()}</span>
                    <ArrowIconFilled className={`select__icon ${this.state.isOpen ? "up" : ""}`} />
                </div>
                {this.state.isOpen && (
                    <div className="fullscreen-overlay">
                        <div ref={this.panelRef} onClick={e => e.stopPropagation()} className="select__mobile__options">
                            {searchAble && this.renderQuery()}
                            {optionsFiltered.length ? optionsFiltered.map((option, index) => (
                                <div
                                    key={`${option.value}_${index}`}
                                    className={`select__mobile__options__option ${option.value === value ? "active" : ""}`}
                                    onClick={() => this.handleChange(option.value)}
                                >
                                    {multiple ? (
                                        <Checkbox
                                            label={option.label}
                                            checked={value?.includes(option.value) ? true : false}
                                            onChange={() => this.handleChange(option.value)}
                                        />
                                    ) : (
                                        <span>{option.label}</span>
                                    )}

                                </div>
                            )) : (
                                <div className="select__mobile__options__option">
                                    <span className="font-normal text-gray-400">Empty results</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    } 

    render() {
        const { isMobileDevice, isActionList } = this.props;
        return isMobileDevice && !isActionList ? this.renderMobile() : this.renderDesktop();
    }
}

const clickOutsideConfig = {
    handleClickOutside: function (instance) {
        return instance.handleClose;
    }
}; 

const SelectP2PFilter: typeof SelectP2PFilterComponent = onClickOutside(SelectP2PFilterComponent, clickOutsideConfig);

const mapStateToProps = (state: RootState): ReduxProps => ({
    isMobileDevice: selectMobileDeviceState(state),
});

export default connect(mapStateToProps)(SelectP2PFilter);