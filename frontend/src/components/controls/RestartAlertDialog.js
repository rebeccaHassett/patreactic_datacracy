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

export default function RestartDialog(props) {
    const [open, setOpen] = React.useState(false);


    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const restartSelected = () => {
      handleClose();
      props.restart();
    };

    return (
        <div>
            <Button variant="contained" color="secondary" disabled={props.districtToggleDisabled} onClick={handleClickOpen}
                    style={{width: '25vw', marginTop: '2vw'}}>
                Restart
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                PaperComponent={PaperComponent}
                aria-labelledby="draggable-dialog-title"
            >
                <DialogTitle style={{cursor: 'move'}} id="draggable-dialog-title">
                    Restart
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                       If you select YES, then you will be redirected to phase 0 to select a new election to perform analysis on, but you will lose current
                        progress on this election and set of results.
                        If you select NO, then you can continue with this set of data.
                        Are you sure you want to restart?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleClose} color="primary">
                        NO
                    </Button>
                    <Button autoFocus onClick={restartSelected} color="primary">
                        YES
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}