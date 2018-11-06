import {TCollect} from '../types';

export default function combineCollects(...collects: Array<TCollect<any>>) {
    return (...args: any) =>
        collects.reduce((result, collect) => {
            const data = collect(...args);
            return {...result, ...(data as object)};
        }, {});
}
