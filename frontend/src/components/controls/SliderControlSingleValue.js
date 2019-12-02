import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';

const useStyles = makeStyles({
    root: {
        width: "100%",
    },
});

function valuetext(value) {
    return `${value}°C`;
}

export default function SliderControlSingleValue(props) {
    const classes = useStyles();
    const [value, setValue] = React.useState(80);

    return (
        <div className={classes.root}>
            <Slider
                value={value}
                onChange={(event, newValue) => {
                    setValue(newValue);
                    props.exportState(newValue);
                }}
                valueLabelDisplay="auto"
                aria-labelledby="custom thumb label"
                getAriaValueText={valuetext}
                marks={props.marks}
                min={props.min}
                max={props.max}
                step={props.step}
                defaultValue={props.max}
            />
        </div>
    );
}


