import * as React from 'react';
import {withRouter, RouteComponentProps} from 'react-router-dom';
import {Consumer} from './TrackerContext';
import {TrackProvider} from '../providers/empty';
import {Location} from 'history';
import {match} from 'react-router';

export interface TrackPageViewCoreProp extends RouteComponentProps {
    tracker: TrackProvider<[Location, match]>;
}

class TrackPageViewCore extends React.Component<TrackPageViewCoreProp> {
    componentDidMount(): void {
        this.trackPageView();
    }

    componentDidUpdate(prevProps: TrackPageViewCoreProp): void {
        if (prevProps.location !== this.props.location) {
            this.trackPageView();
        }
    }

    trackPageView(): void {
        const {location, match, tracker} = this.props;

        tracker.trackPageView(location, match);
    }

    render() {
        return this.props.children;
    }
}

const TrackPageViewWithRouter = withRouter(TrackPageViewCore);

const TrackPageView: React.SFC<object> = props => (
    <Consumer>
        {tracker => <TrackPageViewWithRouter {...props} tracker={tracker} />}
    </Consumer>
);

export default TrackPageView;
