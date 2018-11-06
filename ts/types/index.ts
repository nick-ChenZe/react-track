import {Location as HistoryLocation} from 'history';
import {match} from 'react-router';

export interface BrowserInfo {
    userAgent: string;
    resolution: {
        width: number;
        height: number;
    };
    os: {
        family: string;
        version: string;
    };
    browser: {
        name: string;
        version: string;
    };
    language: string;
}

export type TCollect < R extends object > = (type?: string, source?: object) => R;

export enum TrackProviderEnum {
    install = 'install',
    uninstall = 'uninstall',
    trackPageView = 'trackPageView',
    trackEvent = 'trackEvent',
}

export declare type TBaseTrackProvider = { [key in TrackProviderEnum]?: unknown };

export interface TrackProvider<PageTrackArg extends any[], EventTrackArg extends any[]> extends TBaseTrackProvider {
    install?: () => void;
    uninstall?: () => void;
    trackPageView: (...args: PageTrackArg) => void | (() => void);
    trackEvent: (...args: EventTrackArg) => void;
}

export interface Event {
    category: string;
    action: string;
    label: string;
}

export interface Location extends HistoryLocation {
    path: string;
    match: match;
}
