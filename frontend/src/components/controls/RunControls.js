import React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';

const RunControls = (props) => {
    const [value, setValue] = React.useState('incremental');

    const handleChange = event => {
        setValue(event.target.value);
    };


    return (
        <div>
            <FormControl component="fieldset" color="primary">
                <RadioGroup aria-label="run-type" name="Run Type" value={value} onClick={props.exportState}
                            onChange={handleChange}>
                    <FormControlLabel value="incremental" control={<Radio color="primary"/>} label="Incremental"/>
                    <FormControlLabel value="nonIncrementalRealtime" control={<Radio color="primary"/>}
                                      label="Non-Incremental Realtime"/>
                    <FormControlLabel value="nonIncrementalSingleUpdate" control={<Radio color="primary"/>}
                                      label="Non-Incremental Single Update"/>
                </RadioGroup>
            </FormControl>
        </div>
    );
};

export default RunControls;