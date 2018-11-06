import * as React from 'react';
import TrackEvent, {TrackEventProp} from '../components/TrackEvent';

declare type TComponentOut < P extends object > = React.SFC<P>;
declare type TComponetInWrapper < P extends object > = (ComponentIn: React.ComponentClass | string) => TComponentOut<P>;
declare type TTrackEvent < P extends object = {} > = (trackEventProps: TrackEventProp) => TComponetInWrapper<P>;

const trackEvent: TTrackEvent = <P extends object>(trackEventProps: TrackEventProp) => ComponentIn => {
    const ComponentOut: TComponentOut<P> = props => (
        <TrackEvent {...trackEventProps}>
            <ComponentIn {...props} />
        </TrackEvent>
    );

    ComponentOut.displayName = `trackEvent(${(ComponentIn as React.ComponentClass).displayName
        || (ComponentIn as React.ComponentClass).name
        || 'Unknown'})`;

    return ComponentOut;
};

export default trackEvent;
