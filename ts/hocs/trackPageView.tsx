import * as React from 'react';
import TrackPageView from '../components/TrackPageView';

export default <P extends object>(ComponentIn: React.SFC<P>) => {
    const ComponentOut = (props: P) => (
        <TrackPageView>
            <ComponentIn {...props} />
        </TrackPageView>
    );

    ComponentOut.displayName = `trackPageView(${ComponentIn.displayName || ComponentIn.name || 'Unknown'})`;

    return ComponentOut;
};
