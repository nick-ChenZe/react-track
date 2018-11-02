import * as React from 'react';
import * as PropTypes from 'prop-types';
import createEmptyTrackProvider, {TrackProvider, TrackProviderEnum} from '../providers/empty';
import {TCollect} from '../collect/combineCollects';
import {TLocation, Event} from '../providers/print';
import {createMemoizer} from '../utils';
import {Provider} from './TrackerContext';

// inner是一个track对象
const createLazyProvider = <P extends [], E extends []>(inner: TrackProvider<P, E>) => {
    let installed: boolean = false;
    const queue: Array<[TrackProviderEnum, P | E]> = [];

    // 如果初始化了则执行相应的track
    // 反之则往队列里推一个combine，name类型，args是动态传参
    const queueBeforeInstall = (name: TrackProviderEnum) => (...args: P | E) => {
        if (installed) {
            (inner[name] as any)(...args);
        }
        else {
            queue.push([name, args]);
        }
    };

    // 返回一个包含闭包的对象，执行install时，更新queue，
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

// 给provider提供track的上下文，track有pageView和Event两个场景
// pageView需要当前location和referrer，event则需要事件类型
// collect是一个函数，用于返回过滤过的数据对象，由组件的prop决定
// provider是一个track对象
const createTrackerContext = (
    collect: TCollect<any>,
    provider: TrackProvider<[TLocation], [Event]>,
): TrackProvider<[TLocation, { path: string }], [Event]> => {
    let currentLocation: TLocation;

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
    provider: TrackProvider;
}

export interface TrackState {
    sourceProvider: TrackProvider;
    provider: TrackProvider;
}

export default class Tracker extends React.Component<TrackProps, TrackState> {
    static propTypes = {
        collect: PropTypes.func.isRequired,
        provider: PropTypes.object.isRequired,
    };

    state: Readonly<TrackState> = {
        sourceProvider: createEmptyTrackProvider(),
        provider: createEmptyTrackProvider(),
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

        provider.install!();
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

        provider.uninstall!();
    }

    render() {
        const {collect, children} = this.props;
        const {provider} = this.state;
        const tracker = this.getTracker(collect, provider);

        return <Provider value={tracker}>{children}</Provider>;
    }
}
