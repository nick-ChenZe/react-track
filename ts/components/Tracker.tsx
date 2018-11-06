import * as React from 'react';
import * as PropTypes from 'prop-types';
import {TrackProvider, TrackProviderEnum, TCollect, Location, Event} from '../types';
import {createMemoizer} from '../utils';
import {Provider} from './TrackerContext';

const createLazyProvider = (inner: TrackProvider<any, any>): TrackProvider<any, any> => {
    let installed: boolean = false;
    const queue: Array<[TrackProviderEnum, any]> = [];

    const queueBeforeInstall = (name: TrackProviderEnum) => (...args: any) => {
        if (installed) {
            (inner[name] as any)(...args);
        }
        else {
            queue.push([name, args]);
        }
    };

    return {
        install() {
            inner.install!();
            installed = true;

            for (const [name, args] of queue) {
                (inner[name] as any)(...args);
            }

            queue.length = 0;
        },
        uninstall() {
            inner.uninstall!();
            queue.length = 0;
        },
        trackPageView: queueBeforeInstall(TrackProviderEnum.trackPageView),
        trackEvent: queueBeforeInstall(TrackProviderEnum.trackEvent),
    };
};

const createTrackerContext = (
    collect: TCollect<any>,
    provider: TrackProvider<[Location], [Event]>,
): TrackProvider<[Location, { path: string }], [Event]> => {
    let currentLocation: Location;

    return {
        trackPageView(location, {path}) {
            const referrer = currentLocation;
            currentLocation = {...location, path};
            const data = {
                ...collect('pageView', location),
                referrer,
                location: currentLocation,
            };

            provider.trackPageView(data);
        },

        trackEvent(event) {
            const data = {
                ...collect('event'),
                ...event,
            };

            provider.trackEvent(data);
        },
    };
};

export interface TrackProps {
    collect: TCollect<any>;
    provider: TrackProvider<any, any>;
}

export interface TrackState {
    sourceProvider: null | TrackProvider<any, any>;
    provider: null | TrackProvider<any, any>;
}

export default class Tracker extends React.Component<TrackProps, TrackState> {
    static propTypes = {
        collect: PropTypes.func.isRequired,
        provider: PropTypes.object.isRequired,
    };

    state: Readonly<TrackState> = {
        sourceProvider: null,
        provider: null,
    };

    getTracker = createMemoizer(createTrackerContext);

    getProvider = createMemoizer(createLazyProvider);

    static getDerivedStateFromProps({provider}: TrackProps, {sourceProvider}: TrackState) {
        if (provider === sourceProvider) {
            return null;
        }

        return {
            sourceProvider: provider,
            provider: createLazyProvider(provider),
        };
    }

    componentDidMount() {
        const {provider} = this.state;

        provider!.install!();
    }

    componentDidUpdate(prevProps: TrackProps) {
        const {provider} = this.props;

        if (provider !== prevProps.provider) {
            prevProps.provider.uninstall!();
            provider.install!();
        }
    }

    componentWillUnmount() {
        const {provider} = this.state;

        provider!.uninstall!();
    }

    render() {
        const {collect, children} = this.props;
        const {provider} = this.state;
        const tracker = this.getTracker(collect, provider);

        return <Provider value={tracker}>{children}</Provider>;
    }
}
