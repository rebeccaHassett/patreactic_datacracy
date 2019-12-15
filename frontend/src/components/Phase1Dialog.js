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

export default function Phase1Dialog(props) {
    const [open, setOpen] = React.useState(false);


    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Button variant="outlined" color="primary" onClick={handleClickOpen}
                    style={{width: '25vw', marginBottom: '1vw', marginTop: '3vw'}}>
                About Phase 1 Weights
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                PaperComponent={PaperComponent}
                aria-labelledby="draggable-dialog-title"
            >
                <DialogTitle style={{cursor: 'move'}} id="draggable-dialog-title">
                    About Phase 1
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Phase 1 joins precincts to generate new districts based on measures such as minority population of combined precincts as well as
                        compactness, partisan fairness, and other measures for determining the degree of gerrymandering in a district. Determining the
                        majority-minority districts in the state is dominant in phase 1. The majority-minority weight is weighted between 50%-100%.
                        The other measures are normalized and weighted between 0%-50% depending on the majority-minority weighting.
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