import * as React from 'react';
import * as PropTypes from 'prop-types';
import {noop} from 'lodash';
import {trackEvent} from '../../ts';

interface InputProps {
    onNameChange: (value: string) => void;
}

const Input = trackEvent({
    eventPropName: 'onChange',
    category: 'input',
    action: 'change',
    label: 'Name',
})('input') as any;

export default class NameInput extends React.PureComponent<InputProps> {
    static propTypes = {
        onNameChange: PropTypes.func,
    };

    static defaultProps = {
        onNameChange: noop,
    };

    constructor(props: InputProps) {
        super(props);

        this.state = {value: ''};
    }

    handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;

        this.setState({value});
        this.props.onNameChange(value);
    }

    render() {
        return <Input onChange={this.handleChange} />;
    }
}
