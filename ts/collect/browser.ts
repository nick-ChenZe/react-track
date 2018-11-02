import * as platform from 'platform';

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

export default () => {
    const {ua, name, version, os} = platform.parse!(navigator.userAgent);

    return (type: string): BrowserInfo | null => {
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
    };
};
