import {noop} from 'lodash';
import {TrackProvider} from './empty';
import {Location} from 'history';

export interface Event {
    category: string;
    action: string;
    label: string;
}

export declare type TLocation = Location & { path: string};

declare type TFormatUrl = (location: TLocation) => string;
const formatURL: TFormatUrl = ({pathname, search, hash, path}) => {
    const parts = [pathname, search ? '?' + search : '', hash ? '#' + hash : ''];

    return parts.join('') + '(' + path + ')';
};

/* eslint-disable no-console */
declare type TPrint = () => TrackProvider<[{ location: TLocation; referrer: TLocation }], [Event]>;
const print: TPrint = () => {
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
