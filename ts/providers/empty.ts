import {noop} from 'lodash';
import {TrackProvider} from '../types';

const provider: TrackProvider<[], []> = {
    install: noop,
    uninstall: noop,
    trackPageView: noop,
    trackEvent: noop,
};

export default () => provider;
