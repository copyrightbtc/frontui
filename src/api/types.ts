declare global {
    interface Config {
        api: {
            authUrl: string;
            tradeUrl: string;
            applogicUrl: string;
            rangerUrl: string;
            p2pUrl: string;
        };
        withCredentials: string | boolean;
        incrementalOrderBook: string | boolean;
        isResizable: string | boolean;
        isDraggable: string | boolean;
        sentryEnabled: string | boolean;
        captchaLogin: string | boolean;
        usernameEnabled: string | boolean;
        gaTrackerKey: string;
        minutesUntilAutoLogout: string;
        msAlertDisplayTime: string;
        msPricesUpdates: string;
        sessionCheckInterval: string;
        balancesFetchInterval: string;
        passwordEntropyStep: string | number;
        storage: {
            defaultStorageLimit: string | number;
            orderBookSideLimit: string | number;
        };
        languages: string[];
        kycSteps: string[];
        password_min_entropy: string | number;
        palette?: string;
        barong_upload_size_min_range?: string;
        barong_upload_size_max_range?: string;
        tradesfor_platform_currency?: string;
        footerNavigation?: string;
        footerSocials?: string;
        navigations?: string;
        logo_icons?: string;
        fontFamily?: string;
        tvDefaultCandles: number;
    }

    interface Window {
        env: Config;
    }
}

export {};
