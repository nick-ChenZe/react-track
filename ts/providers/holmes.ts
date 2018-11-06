import {Location, Event, TrackProvider} from '../types';
const HOLMES_SCRIPT_SRC = 'https://hm.baidu.com/hm.js';

/* globals _hmt */
/* eslint-disable no-underscore-dangle, no-empty-function */

declare var _hmt: any[];
declare global {
    interface Window {
        _hmt: any[];
    }
}

declare type TFormatUrl = (location: Location) => string;
const formatURL: TFormatUrl = ({pathname, search, hash}) => {
    const parts = [pathname, search ? '?' + search : '', hash ? '#' + hash : ''];

    return parts.join('');
};

declare type THolmes = (site: string) => TrackProvider<[{ location: Location }], [Event]>;
const holmes: THolmes = site => {
    // The first time `hm.js`
    return {
        install() {
            if (typeof window._hmt === 'undefined') {
                window._hmt = [['_setAutoPageview', false]];

                const script = document.createElement('script');
                script.src = HOLMES_SCRIPT_SRC + '?' + site;
                const head: HTMLHeadElement = document.head as HTMLHeadElement;
                head.appendChild(script);
            }
        },

        /* tslint:disable-next-line */
        uninstall() {},

        trackPageView({location}): void {
            _hmt.push(['_trackPageview', formatURL(location)]);
        },

        trackEvent({category, action, label}: Event): void {
            _hmt.push(['_trackEvent', category, action, label]);
        },
    };
};

export default holmes;
