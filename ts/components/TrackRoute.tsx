import * as React from 'react';
import {Route, RouteProps} from 'react-router-dom';
import TrackPageView from './TrackPageView';

const TrackRoute: React.SFC<RouteProps> = ({render, children, component, ...props}) => (
    <Route {...props}>
        <TrackPageView>
            <Route render={render} component={component}>
                {children}
            </Route>
        </TrackPageView>
    </Route>
);

export default TrackRoute;
