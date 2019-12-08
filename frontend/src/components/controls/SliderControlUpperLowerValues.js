import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';

const useStyles = makeStyles({
    root: {
        width: "100%",
    },
});

function valuetext(value) {
    return `${value}°C`;
}

export default function SliderControlUpperLowerValues(props) {
    const classes = useStyles();
    const [value, setValue] = React.useState([80, 90]);

    return (
        <div className={classes.root}>
            <Slider
                value={value}
                onChange={(event, newValue) => {
                    setValue(newValue);
                    props.exportState(newValue);
                }}
                valueLabelDisplay="auto"
                aria-labelledby="range-slider"
                getAriaValueText={valuetext}
                marks={blocMarks}
                min={50}
                max={100}
                disabled={props.disabled}
            />
        </div>
    );
}

const blocMarks = [
    {
        value: 50,
        label: '50%',
    },
    {
        value: 60,
        label: '60%',
    },
    {
        value: 70,
        label: '70%',
    },
    {
        value: 80,
        label: '80%',
    },
    {
        value: 90,
        label: '90%',
    },
    {
        value: 100,
        label: '100%',
    },
];