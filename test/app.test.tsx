import * as React from 'react';
import {MemoryRouter, NavLink, Switch} from 'react-router-dom';
import {mount} from 'enzyme';
import {noop} from 'lodash';
import NameInput from './components/NameInput';
import {
    Tracker,
    TrackRoute,
    TrackEvent,
    TrackProvider,
    combineCollects,
    browser,
    context,
    session,
    composeProvider,
    print,
    holmes,
    trackPageView,
    empty,
} from '../ts';

const collect = combineCollects(session(), browser(), context({env: 'test'}));

describe('test page event with react router', () => {
    const mockPageEventHandler = jest.fn(x => x);
    const mockTrackEventHandler = jest.fn(x => x);
    const trackProvider: TrackProvider<any, any> = {
        install: noop,
        uninstall: noop,
        trackPageView: mockPageEventHandler,
        trackEvent: mockTrackEventHandler,
    };
    const trackProviders = composeProvider(trackProvider, holmes('any'),  print());

    const mockLogHandler = jest.fn();
    /* tslint:disable-next-line */
    console.log = mockLogHandler;

    const About = () => <div>AboutMe</div>;
    const RouteTrack = () => (
        <Tracker collect={collect} provider={trackProviders}>
            <MemoryRouter initialEntries={['/']}>
                <div>
                    <nav>
                        <TrackEvent eventPropName="onClick" category="navigation" action="click" label="About">
                            <NavLink exact to="/about">
                                About
                            </NavLink>
                        </TrackEvent>
                    </nav>
                    <Switch>
                        <TrackRoute exact path="/">
                            <p>Root</p>
                        </TrackRoute>
                        <TrackRoute exact path="/about" render={About} />
                    </Switch>
                </div>
            </MemoryRouter>
        </Tracker>
    );

    const wrapper = mount(<RouteTrack />);
    it('provider.trackPageView handler should be invoked after initial render', () => {
        expect(mockPageEventHandler.mock.calls[0][0].location.path).toBe('/');
    });
    it('provider.trackPageView handler should collect context variable', () => {
        expect(mockTrackEventHandler.mock.calls[0][0].env).toBe('test');
    });

    // why {button: 0} flag here?
    // https://github.com/airbnb/enzyme/issues/516
    wrapper.find('a').simulate('click', {button: 0});
    it('provider.trackPageView handler should be invoked after redirect to /about', () => {
        expect(wrapper.contains(<div>AboutMe</div>)).toBe(true);
    });

    it('provider.trackEvent handler should be invoked after click', () => {
        // print like this
        // {
        // "browser": { "name": null, "version": null },
        // "env": "test",
        // "language": "en-US",
        // "location": { "hash": "", "key": "lqd1ce", "path": "/", "pathname": "/", "search": "", "state": undefined },
        // "os": { "family": null, "version": null },
        // "referrer": undefined,
        // "resolution": { "height": 0, "width": 0 },
        // "session": "fb0e9ada-d47a-4c99-8fe6-b8de2229f55d",
        // "userAgent": "Mozilla/5.0 (darwin) AppleWebKit/537.36 (KHTML, like Gecko) jsdom/11.12.0"
        // }
        expect(mockPageEventHandler.mock.calls[0][0].userAgent).toContain('jsdom');
    });

    // 2 pageEvents and 1 browserEvent
    it('print.provider should be invoked and trigger console 3 times', () => {
        expect(mockLogHandler.mock.calls.length).toBe(3);
    });

    // 2 pageEvents, 1 browserEvent and 1 default value
    it('holmes.provider should be invoked, and global variable _hmt.length should equals to 4', () => {
        expect((global as any)._hmt.length).toBe(4);
    });

});

describe('test browser event', () => {
    const mockNameInputHandler = jest.fn(x => x);
    const provider = empty();
    const wrapper = mount(
        <Tracker collect={collect} provider={provider}>
            <NameInput onNameChange={mockNameInputHandler}/>
            <TrackEvent eventPropName="onClick" category="navigation" action="click">
                <button>Button</button>
            </TrackEvent>
        </Tracker>);

    wrapper.find('input').simulate('change',  {target: {value: 'test value'}});
    it('eventTrackHandler should be invoked', () => {
        expect(mockNameInputHandler.mock.calls[0][0]).toBe('test value');
    });
    wrapper.unmount();
});

interface TitleProp {
    name: string;
}
describe('test hoc', () => {
    const About = ({name}: TitleProp) => <h1>{name}</h1>;
    const AboutPageView = trackPageView<TitleProp>(About);
    const mockEventHandler = jest.fn();
    const pageProvider = {
        install: noop,
        uninstall: noop,
        trackPageView: mockEventHandler,
        trackEvent: noop,
    };
    const wrapper = mount(
        <Tracker collect={collect} provider={pageProvider}>
            <MemoryRouter initialEntries={['/about']}>
                <div>
                    <nav>
                        <TrackEvent eventPropName="onClick" category="navigation" action="click" label="About">
                            <NavLink exact to="/about">
                                About
                            </NavLink>
                        </TrackEvent>
                    </nav>
                    <Switch>
                        <TrackRoute exact path="/">
                            <p>Root</p>
                        </TrackRoute>
                        <TrackRoute exact path="/about">
                            <AboutPageView name="test"/>
                        </TrackRoute>
                    </Switch>
                </div>
            </MemoryRouter>
        </Tracker>);

    it('AboutPageView should render correctly', () => {
        expect(mockEventHandler.mock.calls[0][0].location.path).toBe('/about');
        expect(wrapper.contains(<h1>test</h1>)).toBe(true);
    });

    wrapper.setProps({provider: pageProvider});
});
