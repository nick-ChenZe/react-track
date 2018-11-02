import {TrackProvider, TrackProviderEnum} from './empty';

declare type TChain<P extends any[], E extends any[]> = (name: TrackProviderEnum) => (...args: P | E) => void;

export default <P extends any[], E extends any[]>(...providers: Array<TrackProvider<P, E>>) => {
    // can not detect option rest parameter
    const chain: TChain<P, E> = name => (...args) => providers.forEach(provider => (provider[name] as any)(...args));

    return {
        install: chain(TrackProviderEnum.install),
        uninstall: chain(TrackProviderEnum.uninstall),
        trackPageView: chain(TrackProviderEnum.trackPageView),
        trackEvent: chain(TrackProviderEnum.trackEvent),
    };
};
