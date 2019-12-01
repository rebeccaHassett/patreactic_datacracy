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
            />
        </div>
    );
}

const blocMarks = [
    {
        value: 0,
        label: '0%',
    },
    {
        value: 20,
        label: '20%',
    },
    {
        value: 40,
        label: '40%',
    },
    {
        value: 60,
        label: '60%',
    },
    {
        value: 80,
        label: '80%',
    },
    {
        value: 100,
        label: '100%',
    },
];