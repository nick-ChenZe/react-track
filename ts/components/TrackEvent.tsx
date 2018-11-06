import * as React from 'react';
import * as PropTypes from 'prop-types';
import {noop} from 'lodash';
import {createMemoizer} from '../utils';
import {Consumer} from './TrackerContext';
import {TrackProvider, Event} from '../types';

declare type TUnkownFunction = (...args: any[]) => any;
declare type TTrackEventParams = [TUnkownFunction, TrackProvider<any[], [Event]>, string, string, string];
const trackEventCallback = (
    previousPropValue: TUnkownFunction,
    tracker: TrackProvider<any[], [Event]>,
    category: string,
    action: string,
    label: string,
) => (...args: any[]) => {
    tracker.trackEvent({category, action, label});

    return previousPropValue(...args);
};

const createTrackedCallback = createMemoizer<TTrackEventParams, TUnkownFunction>(trackEventCallback);

export interface TrackEventProp {
    eventPropName: string;
    category: string;
    action: string;
    label?: string;
    children?: React.ReactNode | ((tracker: TrackProvider<any, any>) => React.ReactNode);
}

export default class TrackEvent extends React.Component<TrackEventProp> {
    static propTypes = {
        eventPropName: PropTypes.string.isRequired,
        category: PropTypes.string.isRequired,
        action: PropTypes.string.isRequired,
        label: PropTypes.string,
        children: PropTypes.element.isRequired,
    };

    static defaultProps = {
        label: null,
    };

    renderChildren(tracker: TrackProvider<any[], [Event]>) {
        const {children, eventPropName, category, action, label, ...args} = this.props;

        if (!children || !((children as React.ReactElement<any>).props)) {
            return children;
        }

        const callback = (children as React.ReactElement<any>).props[eventPropName] || noop;
        const trackedCallback = createTrackedCallback(callback, tracker, category, action, label!);

        return React.cloneElement((children as React.ReactElement<any>), {...args, [eventPropName]: trackedCallback});
    }

    render() {
        return <Consumer>{tracker => this.renderChildren(tracker)}</Consumer>;
    }
}
