import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';
import {forEach} from "react-bootstrap/cjs/utils/ElementChildren";

function PaperComponent(props) {
    return (
        <Draggable cancel={'[class*="MuiDialogContent-root"]'}>
            <Paper {...props} />
        </Draggable>
    );
}

export default function VotingBlocSummaryDialog(props) {
    const [open, setOpen] = React.useState(false);
    let numVBPrecincts = 0;
    let demographics = ["White", "Black", "Asian", "Hispanic", "Native_American"];
    let demographicsVBPrecincts = {"White": 0, "Black": 0, "Asian": 0, "Hispanic": 0, "Native_American": 0};
    let demographicMostVB = "None";
    let numDemographicMostVB = 0;
    let numDemocraticVBPrecincts = 0;
    let numRepublicanVBPrecincts = 0;
    let votesWinningPartyOverall = 0;
    let winningPartyOverallPrecinctsTotalVotes = 0;
    let votePercentageWinningPartyOverall = 0;
    let winningPartyOverall = "";


    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const wordCase = (str) => {
        var splitStr = str.toLowerCase().split(' ');
        for (var i = 0; i < splitStr.length; i++) {

            splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
        }
        return splitStr.join(' ');
    };

    numVBPrecincts = props.data.length;
    props.data.forEach(row => {
        demographics.forEach(demographic => {
            if(row.demographic === demographic) {
                demographicsVBPrecincts[demographic] = demographicsVBPrecincts[demographic] + 1;
            }
        })
    });

    demographics.forEach(demographic => {
        if(demographicsVBPrecincts[demographic] > numDemographicMostVB) {
            numDemographicMostVB = demographicsVBPrecincts[demographic];
            demographicMostVB = demographic;
        }
    });

    props.data.forEach(row => {
       if(row.demographic === demographicMostVB && row.winningParty === "Democrat") {
           numDemocraticVBPrecincts = numDemocraticVBPrecincts + 1;
       }
       else if(row.demographic === demographicMostVB && row.winningParty === "Republican") {
           numRepublicanVBPrecincts = numRepublicanVBPrecincts + 1;
       }
    });


    if(numDemocraticVBPrecincts > numRepublicanVBPrecincts) {
        winningPartyOverall = "Democrat";
    }
    else {
        winningPartyOverall = "Republican";
    }

    props.data.forEach(row => {
           if(row.demographic === demographicMostVB && row.winningParty === winningPartyOverall) {
               console.log(row.totalVotes);
               winningPartyOverallPrecinctsTotalVotes = winningPartyOverallPrecinctsTotalVotes + row.totalVotes;
               votesWinningPartyOverall = votesWinningPartyOverall + row.winningVotes;
           }
    });
    votePercentageWinningPartyOverall = (votesWinningPartyOverall / winningPartyOverallPrecinctsTotalVotes) * 100;

    if(demographicMostVB !== "None") {
        return (
            <div>
                <Button variant="outlined" color="primary" onClick={handleClickOpen}
                        style={{width: '25vw', marginBottom: '2vw'}}>
                    View Voting Bloc Summary
                </Button>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    PaperComponent={PaperComponent}
                    aria-labelledby="draggable-dialog-title"
                >
                    <DialogTitle style={{cursor: 'move'}} id="draggable-dialog-title">
                        Voting Bloc Summary
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            <h4>Total Voting Bloc Precincts: {numVBPrecincts.toLocaleString()}</h4>
                            <ul>
                                <li>Total White Voting Bloc Precincts: {demographicsVBPrecincts["White"].toLocaleString()}</li>
                                <li>Total Black Voting Bloc Precincts: {demographicsVBPrecincts["Black"].toLocaleString()}</li>
                                <li>Total Asian Voting Bloc Precincts: {demographicsVBPrecincts["Asian"].toLocaleString()}</li>
                                <li>Total Hispanic Voting Bloc Precincts: {demographicsVBPrecincts["Hispanic"].toLocaleString()}</li>
                                <li>Total Native American Voting Bloc Precincts: {demographicsVBPrecincts["Native_American"].toLocaleString()}</li>
                            </ul>
                            <h4>Most of the voting blocs are {demographicMostVB.toLocaleLowerCase()}</h4>
                            <ul>
                                <li>{numDemocraticVBPrecincts.toLocaleString()} of these {demographicMostVB.toLocaleLowerCase()} voting bloc precincts voted Democrat</li>
                                <li>{numRepublicanVBPrecincts.toLocaleString()} of these {demographicMostVB.toLocaleLowerCase()} voting bloc precincts voted Republican</li>
                            </ul>
                            <h4>Most {demographicMostVB.toLocaleLowerCase()} voting blocs voted {winningPartyOverall.toLocaleLowerCase()}</h4>
                            <ul>
                            <li>{demographicMostVB} voting blocs had {votesWinningPartyOverall.toLocaleString()} votes out
                                of {winningPartyOverallPrecinctsTotalVotes.toLocaleString()} total votes for {winningPartyOverall}s.</li>
                                <li>This is {Math.round(votePercentageWinningPartyOverall)}% of the votes</li>
                            </ul>
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
    else {
        return (
            <div>
                <Button variant="outlined" color="primary" onClick={handleClickOpen}
                        style={{width: '25vw', marginBottom: '2vw'}} disabled={true}>
                    View Voting Bloc Summary
                </Button>
            </div>
        );
    }
}
