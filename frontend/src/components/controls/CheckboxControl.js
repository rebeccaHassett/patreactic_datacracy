import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    formControl: {
        margin: theme.spacing(1),
    },
}));

export default function CheckboxControl(props) {
    const classes = useStyles();
    const [state, setState] = React.useState({
        BLACK: false,
        ASIAN: false,
        HISPANIC: false,
        WHITE: false,
        NATIVE_AMERICAN: false,
    });

    const handleChange = name => event => {
        setState({ ...state, [name]: event.target.checked });
    };

    const { BLACK, ASIAN, HISPANIC, WHITE, NATIVE_AMERICAN} = state;
    const error = [BLACK, ASIAN, HISPANIC, WHITE, NATIVE_AMERICAN].filter(v => v).length === 0;

    return (
        <div className={classes.root} color="primary">
            <FormControl component="fieldset" className={classes.formControl}>
                <FormGroup>
                    <FormControlLabel
                        control={<Checkbox color="primary" checked={BLACK} onClick={handleChange('BLACK')} onChange={props.exportState} value="BLACK" />}
                        label="African American"
                    />
                    <FormControlLabel
                        control={<Checkbox color="primary" checked={ASIAN} onClick={handleChange('ASIAN')} value="ASIAN" onChange={props.exportState}/>}
                        label="Asian"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox color="primary" checked={HISPANIC} onClick={handleChange('HISPANIC')} value="HISPANIC" onChange={props.exportState}/>
                        }
                        label="Hispanic"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox color="primary" checked={WHITE} onClick={handleChange('WHITE')} value="WHITE" onChange={props.exportState}/>
                        }
                        label="White"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox color="primary" checked={NATIVE_AMERICAN} onClick={handleChange('NATIVE_AMERICAN')} value="NATIVE_AMERICAN" onChange={props.exportState}/>
                        }
                        label="Native American"
                    />
                </FormGroup>
                <FormHelperText>Must select at least one demographic</FormHelperText>
            </FormControl>
        </div>
    );
}
