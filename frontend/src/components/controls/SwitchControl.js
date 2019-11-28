import React from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

export default function SwitchLabels(props) {
    const [state, setState] = React.useState({
        incremental: false,
        realtime: false,
    });

    const handleChange = name => event => {
        setState({ ...state, [name]: event.target.checked });
    };

    return (
        <FormGroup row>
            <FormControlLabel
                control={
                    <Switch
                        checked={state.incremental}
                        onChange={props.exportIncremental}
                        onClick={handleChange('incremental')}
                        value="incremental"
                        color="primary"
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
                    />
                }
                label="Real-Time"
            />
        </FormGroup>
    );
}
