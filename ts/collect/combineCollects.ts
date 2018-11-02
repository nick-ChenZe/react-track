export type TCollect<R extends object> = (type?: string, source?: object) => R;
export default (...collects: Array<(TCollect<object>)>) => (...args: any[]) =>
    collects.reduce((result, collect) => {
        const data = collect(...args);
        return {...result, ...data};
    }, {});
