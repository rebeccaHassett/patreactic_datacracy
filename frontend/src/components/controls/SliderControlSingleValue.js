import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';

const useStyles = makeStyles({
    root: {
        width: 300,
    },
});

function valuetext(value) {
    return `${value}°C`;
}

export default function SliderControlUpperLowerValues(props) {
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
                style={{width: '18vw'}}
                marks={props.marks}
                min={props.min}
                max={props.max}
                defaultValue={props.max}
            />
        </div>
    );
}


