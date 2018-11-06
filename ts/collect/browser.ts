import * as platform from 'platform';
import {BrowserInfo, TCollect} from '../types';

export default () => {
    const {ua, name, version, os} = platform.parse!(navigator.userAgent);

    return ((type: string) => {
        if (type !== 'pageView') {
            return null;
        }

        return {
            userAgent: ua!,
            resolution: {
                width: screen.width!,
                height: screen.height!,
            },
            os: {
                family: os!.family!,
                version: os!.version!,
            },
            browser: {
                name: name!,
                version: version!,
            },
            language: navigator.language,
        };
    }) as TCollect<BrowserInfo>;
};
