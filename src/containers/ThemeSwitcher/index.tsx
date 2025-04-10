import * as React from 'react';
import {
    connect,
    MapDispatchToPropsFunction,
    MapStateToProps,
} from 'react-redux';
import { compose } from 'redux';
import { Moon } from '../../assets/images/Moon';
import { Sun } from '../../assets/images/Sun'; 
import { IconButton } from '@mui/material';
import {
    changeColorTheme,
    RootState,
    selectCurrentColorTheme,
} from '../../modules';

export interface ReduxProps {
    colorTheme: string;
}

interface DispatchProps {
    changeColorTheme: typeof changeColorTheme;
}

export interface OwnProps {
    onLinkChange?: () => void;
}

type Props = OwnProps & ReduxProps & DispatchProps;

class ThemeSwitcherComponent extends React.Component<Props> {
    public render() {
        const { colorTheme } = this.props;

        return (
            <div
                className="theme-switcher"
                onClick={e => this.handleChangeCurrentStyleMode(colorTheme === 'light' ? 'dark' : 'light')}
            >
                {this.getLightDarkMode()}
            </div>
        );
    }

    private getLightDarkMode = () => {
        const { colorTheme } = this.props;

        if (colorTheme === 'dark') {
            return (
                <React.Fragment>
                    <IconButton
                        className="theme-switcher__icon"
                    >
                        <Sun fillColor={'#fff'}/>
                    </IconButton>
                </React.Fragment>
            );
        }

        return (
            <React.Fragment>
                <IconButton
                    className="theme-switcher__icon dark"
                >
                    <Moon fillColor={'var(--main-dark)'}/>
                </IconButton>
            </React.Fragment>
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

export const ThemeSwitcher = compose(
    connect(mapStateToProps, mapDispatchToProps),
)(ThemeSwitcherComponent) as any;
