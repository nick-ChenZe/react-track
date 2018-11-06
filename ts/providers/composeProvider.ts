import {TrackProvider, TrackProviderEnum} from '../types';

declare type TChain = (name: TrackProviderEnum) => (...args: any) => void;

export default (...providers: Array<TrackProvider<any, any>>) => {
    // can not detect option rest parameter
    const chain: TChain = name => (...args) => providers.forEach(provider => (provider[name] as any)(...args));

    return {
        install: chain(TrackProviderEnum.install),
        uninstall: chain(TrackProviderEnum.uninstall),
        trackPageView: chain(TrackProviderEnum.trackPageView),
        trackEvent: chain(TrackProviderEnum.trackEvent),
    };
};
