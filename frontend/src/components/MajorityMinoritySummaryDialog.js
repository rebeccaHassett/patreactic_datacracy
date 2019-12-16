import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';

function PaperComponent(props) {
    return (
        <Draggable cancel={'[class*="MuiDialogContent-root"]'}>
            <Paper {...props} />
        </Draggable>
    );
}

export default function MajorityMinoritySummaryDialog(props) {
    const [open, setOpen] = React.useState(false);
    const [summaryText, setSummaryText] = React.useState("There are more original majority-minority districts than generated majority-minority districts");
    const equalText = "There are an equal number of original majority-minority districts and generated majority-minority districts";
    const generatedGreaterText = "There are more generated majority-minority districts than original majority-minority districts";
    const generatedLessText = "There are more original majority-minority districts than generated majority-minority districts";
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    console.log(props.generatedMajMin.length);
    console.log(props.originalMajMin.length);

    if(props.generatedMajMin.length > props.originalMajMin.length && !(summaryText === generatedGreaterText)) {
        setSummaryText("There are more generated majority-minority districts than original majority-minority districts");
    }
    else if(props.originalMajMin.length >  props.generatedMajMin.length && !(summaryText === generatedLessText)) {
        setSummaryText("There are more original majority-minority districts than generated majority-minority districts");
    }
    else if(props.originalMajMin.length === props.generatedMajMin.length && !(summaryText === equalText)) {
        setSummaryText("There are an equal number of original majority-minority districts and generated majority-minority districts");
    }

    return (
        <div>
            <Button variant="outlined" color="primary" onClick={handleClickOpen}
                    style={{width: '25vw', marginBottom: '2vw'}}>
                View Majority-Minority District Summary
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                PaperComponent={PaperComponent}
                aria-labelledby="draggable-dialog-title"
            >
                <DialogTitle style={{cursor: 'move'}} id="draggable-dialog-title">
                    Majority-Minority Districts Comparison
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <h5>There were {props.originalMajMin.length} original majority-minority districts</h5>
                        <h5>There are {props.generatedMajMin.length} generated majority-minority districts</h5>
                        <h5> </h5>
                        <h5>{(props.originalMajMin.length / props.originalCDNum) * 100} % of the original districts are majority-minority</h5>
                        <h5>{(props.generatedMajMin.length / props.generatedCDNum) * 100}% of the generated districts are majority-minority</h5>
                        <h5>{summaryText}</h5>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleClose} color="primary">
                        Exit
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}