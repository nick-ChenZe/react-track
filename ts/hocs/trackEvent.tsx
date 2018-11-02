import * as React from 'react';
import TrackEvent, {TrackEventProp} from '../components/TrackEvent';

declare type TComponentOut<P extends object> = React.SFC<P>;
declare type TComponetInWrapper<P extends object> = (ComponentIn: React.ComponentClass) => TComponentOut<P>;
declare type TTrackEvent<P extends object = {}> = (trackEventProps: TrackEventProp) => TComponetInWrapper<P>;

// declare type foo<T extends object = {}> = (arg: number) => T
// 这样能关联到arg参数为number类型
// const bar: foo = (arg) => ({result: arg++})
// 这样不能关联到arg参数为number类型
// const baz: foo = <T extends object>(arg) => ({result: arg++})
// 而且我的vscode不允许我写成这样，把<T>关联成jsx element了
// const baz: foo = <T>(arg) => ({result: arg++})

// ITrackEventProp类型定义没有必要关联两次，但是vscode无法关联 -----------↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓--
const trackEvent: TTrackEvent = <P extends object>(trackEventProps: TrackEventProp) => ComponentIn => {
    const ComponentOut: TComponentOut<P> = props => (
        <TrackEvent {...trackEventProps}>
            <ComponentIn {...props} />
        </TrackEvent>
    );

    ComponentOut.displayName = `trackEvent(${ComponentIn.displayName || ComponentIn.name || 'Unknown'})`;

    return ComponentOut;
};

export default trackEvent;
