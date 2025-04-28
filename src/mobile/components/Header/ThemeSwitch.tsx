import * as React from 'react';
import {
    connect,
    MapDispatchToPropsFunction,
    MapStateToProps,
} from 'react-redux';
import { injectIntl } from 'react-intl';
import { IntlProps } from 'src';
import { compose } from 'redux';
import { Moon } from '../../assets/images/Moon';
import { Sun } from '../../assets/images/Sun';
import {
    changeColorTheme,
    RootState,
    selectCurrentColorTheme,
} from 'src/modules';

export interface ReduxProps {
    colorTheme: string;
}

interface DispatchProps {
    changeColorTheme: typeof changeColorTheme;
}

export interface OwnProps {
    onLinkChange?: () => void;
}

type Props = OwnProps & ReduxProps & DispatchProps & IntlProps;

class ThemeSwitchComponent extends React.Component<Props> {
    public translate = (id: string) => this.props.intl.formatMessage({ id });
    public render() {
        const { colorTheme } = this.props;

        return (
            <div
                className="theme-switch"
                onClick={e => this.handleChangeCurrentStyleMode(colorTheme === 'light' ? 'dark' : 'light')}
            >
                <span>{this.translate('page.mobile.profileLinks.settings.theme')}</span>
                {this.getLightDarkMode()}
            </div>
        );
    }

    private getLightDarkMode = () => {
        const { colorTheme } = this.props;

        if (colorTheme === 'dark') {
            return (
                <div className="theme-switch__wrapper">
                    <div className="theme-icon">
                        <Sun fillColor={'var(--color-light-grey)'}/>
                    </div>
                    <div className="theme-icon theme-icon--active">
                        <Moon fillColor={'var(--color-dark)'}/>
                    </div>
                </div>
            );
        }

        return (
            <div className="theme-switch__wrapper">
                <div className="theme-icon theme-icon--active">
                    <Sun fillColor={'var(--color-dark)'}/>
                </div>
                <div className="theme-icon">
                    <Moon fillColor={'var(--color-light-grey)'}/>
                </div>
            </div>
        );
    };

    private handleChangeCurrentStyleMode = (value: string) => {
        this.props.changeColorTheme(value);
    };
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> =
    (state: RootState): ReduxProps => ({
        colorTheme: selectCurrentColorTheme(state),
    });

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        changeColorTheme: payload => dispatch(changeColorTheme(payload)),
    });

export const ThemeSwitch = compose(
    injectIntl,
    connect(mapStateToProps, mapDispatchToProps),
)(ThemeSwitchComponent) as any;
