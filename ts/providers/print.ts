import {noop} from 'lodash';
import {TrackProvider, Location, Event} from '../types';

const formatURL = ({pathname, search, hash, path}: Location): string => {
    const parts = [pathname, search ? '?' + search : '', hash ? '#' + hash : ''];

    return parts.join('') + '(' + path + ')';
};

const print = (): TrackProvider<[{ location: Location; referrer: Location }], [Event]> => {
    return {
        install: noop,

        uninstall: noop,

        trackPageView({location, referrer}) {
            if (referrer) {
                /* tslint:disable-next-line */
                console.log(`[Track] Move from ${formatURL(referrer)} to ${formatURL(location)}`);
            }
            else {
                /* tslint:disable-next-line */
                console.log(`[Track] Move to ${formatURL(location)}`);
            }
        },

        trackEvent({category, action, label}) {
            /* tslint:disable-next-line */
            console.log(`[Track] Receive custom event ${category}:${action}:${label}`);
        },
    };
};

export default print;
