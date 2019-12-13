import React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';

const ElectionButtonsControl = (props) => {
    const [value, setValue] = React.useState('Presidential 2016');

    const handleChange = event => {
        setValue(event.target.value);
    };


    return (
        <div>
            <FormControl component="fieldset" color="primary">
                <RadioGroup aria-label="election-type" name="election-type" value={value} onClick={props.exportState}
                            onChange={handleChange}>
                    <FormControlLabel value="Presidential 2016" control={<Radio color="primary"/>}
                                      label="Presidential 2016"/>
                    <FormControlLabel value="Congressional 2016" control={<Radio color="primary"/>}
                                      label="Congressional 2016"/>
                    <FormControlLabel value="Congressional 2018" control={<Radio color="primary"/>}
                                      label="Congressional 2018"/>
                </RadioGroup>
            </FormControl>
        </div>
    );
};

export default ElectionButtonsControl;