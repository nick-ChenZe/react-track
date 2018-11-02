import {noop} from 'lodash';

export enum TrackProviderEnum {
    install = 'install',
    uninstall = 'uninstall',
    trackPageView = 'trackPageView',
    trackEvent = 'trackEvent',
}

declare type TBaseTrackProvider = { [key in TrackProviderEnum]?: unknown };

export interface TrackProvider<P extends any[] = [], E extends any[] = []> extends TBaseTrackProvider {
    install?: () => void;
    uninstall?: () => void;
    trackPageView: (...args: P) => void;
    trackEvent: (...args: E) => void;
}

const provider: TrackProvider = {
    install: noop,
    uninstall: noop,
    trackPageView: noop,
    trackEvent: noop,
};

export default () => provider;
