import {v4} from 'uuid';
import {TCollect} from '../types';

const getSessionKey = (key: string) => {
    const storedValue = sessionStorage.getItem(key);

    if (storedValue) {
        return storedValue;
    }

    const newValue = v4();
    sessionStorage.setItem(key, newValue);
    return newValue;
};

export default (key = 'trackingVisitorSession'): TCollect<{session: string}> => () => ({session: getSessionKey(key)});
