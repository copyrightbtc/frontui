import { createBrowserHistory } from 'history';
import * as React from 'react';
import * as ReactGA from 'react-ga';
import { IntlProvider } from 'react-intl';
import { useSelector, useDispatch } from 'react-redux';
import { Router } from 'react-router';
import { gaTrackerKey } from './api';
import { ErrorWrapper } from './containers';
import { useSetMobileDevice } from './hooks';
import * as mobileTranslations from './mobile/translations';
import { configsFetch, configsAuthFetch, selectCurrentLanguage, selectMobileDeviceState } from './modules';
import { languageMap } from './translations';
import WebSocketProvider from './websocket/WebSocket';
import { UniqueIdProvider } from './components/P2PTrading/useUniqueId';

const gaKey = gaTrackerKey();
const browserHistory = createBrowserHistory();

if (gaKey) {
    ReactGA.initialize(gaKey);
    browserHistory.listen((location) => {
        ReactGA.set({ page: location.pathname });
        ReactGA.pageview(location.pathname);
    });
}

/* Mobile components */
const MobileHeader = React.lazy(() => import('./mobile/components/Header').then(({ Header }) => ({ default: Header })));

/* Desktop components */
const AlertsContainer = React.lazy(() => import('./containers/Alerts').then(({ Alerts }) => ({ default: Alerts }))); 
const P2PAlertsContainer = React.lazy(() => import('./containers/P2PAlert').then(({ P2PAlert }) => ({ default: P2PAlert })));
const LayoutContainer = React.lazy(() => import('./routes').then(({ Layout }) => ({ default: Layout })));

const getTranslations = (lang: string, isMobileDevice: boolean) => {
    if (isMobileDevice) {
        return {
            ...languageMap[lang],
            ...mobileTranslations[lang],
        };
    }

    return languageMap[lang];
};
 
const RenderDeviceContainers = () => {
    const isMobileDevice = useSelector(selectMobileDeviceState);
    const shouldRenderMode = 
    browserHistory.location.pathname.includes('/trading')
    || browserHistory.location.pathname.includes('/p2p');

    if (isMobileDevice) {
        return (
            <div className="mobile-version">
                <MobileHeader />
                <AlertsContainer/>
                <P2PAlertsContainer />
                <LayoutContainer/>
            </div>
        );
    }
    
    return (
        <React.Fragment>
            <div className={`${!shouldRenderMode ? 'darkmode' : 'lightmode'}`}><AlertsContainer /></div>
            <P2PAlertsContainer />
            <LayoutContainer />
        </React.Fragment>
    );
};

export const App = () => {
    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(configsFetch());
        dispatch(configsAuthFetch());

        const rootElement = document.documentElement;
        const fontFamily = window.env?.fontFamily ? window.env?.fontFamily : `'IBM Plex Sans', sans-serif`;

        if (rootElement) {
            rootElement.style.setProperty('--font-family', fontFamily);
        };
    }, []);

    useSetMobileDevice();
    const lang = useSelector(selectCurrentLanguage);
    const isMobileDevice = useSelector(selectMobileDeviceState);

    return (
        <IntlProvider locale={lang} messages={getTranslations(lang, isMobileDevice)} key={lang}>
            <UniqueIdProvider> 
                <Router history={browserHistory}>
                    <ErrorWrapper>
                        <React.Suspense fallback={null}>
                            <WebSocketProvider>
                            <RenderDeviceContainers />
                            </WebSocketProvider>
                        </React.Suspense>
                    </ErrorWrapper>
                </Router>
            </UniqueIdProvider>
        </IntlProvider>
    );
};
