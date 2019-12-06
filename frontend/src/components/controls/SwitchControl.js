import React from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import styled from 'styled-components';

export default function SwitchLabels(props) {
    const [state, setState] = React.useState({
        incremental: false,
        realtime: false,
    });

    const handleChange = name => event => {
        setState({ ...state, [name]: event.target.checked });
    };

    return (
        <Row>
            <FormControlLabel
                control={
                    <Switch
                        checked={state.incremental}
                        onChange={props.exportIncremental}
                        onClick={handleChange('incremental')}
                        value="incremental"
                        color="primary"
                        disabled={props.disabled}
                    />
                }
                label="Incremental"
            />
            <FormControlLabel
                control={
                    <Switch
                        checked={state.realtime}
                        onChange={props.exportRealTime}
                        onClick={handleChange('realtime')}
                        value="realtime"
                        color="primary"
                        disabled={props.disabled}
                    />
                }
                label="Real-Time"
            />
        </Row>
    );
}

const Row = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-around;
`;
