import React, { Component } from 'react';
import SliderControlUpperLowerValues from "./controls/SliderControlUpperLowerValues";
import styled from "styled-components";
import Button from '@material-ui/core/Button';
import ElectionButtonsControl from "./controls/ElectionButtonsControl";
import TableDisplay from "./controls/TableDisplay";
import VotingBlocSummaryDialog from "./VotingBlocSummaryDialog";


export default class Phase0Controls extends Component {

    constructor() {
        super();
        this.runPhase0 = this.runPhase0.bind(this);
        this.handleBlocPopulationUpdate = this.handleBlocPopulationUpdate.bind(this);
        this.handleBlocVotingUpdate = this.handleBlocVotingUpdate.bind(this);
        this.handleElectionChanges = this.handleElectionChanges.bind(this);
        this.resultsViewOn = this.resultsViewOn.bind(this);
        this.resultsViewOff = this.resultsViewOff.bind(this);
    }


    state = {
        phase1Tab: false,
        blocPopulationValues: [80, 90],
        blocVotingValues: [80, 90],
        electionType: 'Presidential',
        electionYear: '2016',
        button2018: true,
        resultsUnavailable: true,
        resultsInView: false,
        vbdtoRows: [['-', '-', '-', '-', '-']]
    }

    wordCase(str) {
        var splitStr = str.toLowerCase().split(' ');
        for (var i = 0; i < splitStr.length; i++) {

            splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
        }
        return splitStr.join(' ');
    }

    async runPhase0() {
        var phase0Dto = {
            config: {
                thresholds: {
                    BLOC_POP_PERCENTAGE: {
                        lower: this.state.blocPopulationValues[0] / 100.0,
                        upper: this.state.blocPopulationValues[1] / 100.0
                    },
                    BLOC_VOTING_PERCENTAGE: {
                        lower: this.state.blocVotingValues[0] / 100.0,
                        upper: this.state.blocVotingValues[1] / 100.0
                    }
                },
                weights: {},
                incremental: false,
                realtime: false,
                numDistricts: 0,
                numMajMinDistricts: 0,
                selectedMinorities: [],
                year: this.state.electionYear,
                type: this.state.electionType
            },
            state: this.props.state
        };

        var that = this;
        await fetch("http://127.0.0.1:8080/runPhase0", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(phase0Dto),
        }).then(function(data){
            return data.json();
        }).then(function(vbdtoData) {
            for(let i = 0; i < vbdtoData.length; i++){
                vbdtoData[i].precinctId = that.wordCase(vbdtoData[i].precinctId);
                vbdtoData[i].demographic = that.wordCase(vbdtoData[i].demographic);
                vbdtoData[i].winningParty = that.wordCase(vbdtoData[i].winningParty);
            }
            that.setState({vbdtoRows: vbdtoData})
        });



        this.setState({ resultsUnavailable: false });
        this.setState({ resultsInView: true });
    }

    resultsViewOn() {
        this.setState({ resultsInView: true });
    }

    resultsViewOff() {
        this.setState({ resultsInView: false });
    }

    handleBlocPopulationUpdate(value) {
        this.setState({ blocPopulationValues: value })

    }

    handleBlocVotingUpdate(value) {
        this.setState({ blocVotingValues: value })
    }

    handleElectionChanges(event) {
        if (event.target.value === "Congressional 2016") {
            this.setState({
                election: 'Congressional 2016'
            })
            this.setState({
                electionYear: '2016'
            })
            this.setState({
                electionType: 'Congressional'
            })
        } else if (event.target.value === "Congressional 2018") {
            this.setState({
                election: 'Congressional 2018'
            })
            this.setState({
                electionYear: '2018'
            })
            this.setState({
                electionType: 'Congressional'
            })
        } else if (event.target.value === "Presidential 2016") {
            this.setState({
                election: 'Presidential 2016'
            })
            this.setState({
                electionYear: '2016'
            })
            this.setState({
                electionType: 'Presidential'
            })
        }
    }



    render() {
        if (this.state.resultsUnavailable === true || this.state.resultsInView === false) {
            return (
                <Phase0Styles>
                    <Button variant="contained" color="primary" onClick={this.runPhase0}
                        style={{ width: '25vw', marginBottom: '2vw' }}>Start Phase 0</Button>
                    <ControlGroup>
                        <label className="label">Bloc Population Thresholds:</label>
                        <SliderControlUpperLowerValues disabled={false}
                            exportState={this.handleBlocPopulationUpdate} />
                    </ControlGroup>
                    <ControlGroup>
                        <label className="label">Bloc Voting Thresholds:</label>
                        <SliderControlUpperLowerValues disabled={false}
                            exportState={this.handleBlocVotingUpdate} />
                    </ControlGroup>
                    <ControlGroup>
                        <label className="electionLabel">Election Type:</label>
                        <ElectionButtonsControl exportState={this.handleElectionChanges} />
                    </ControlGroup>
                    <Button variant="contained" color="primary" style={{ width: '25vw', marginBottom: '2vw' }}
                        disabled={this.state.resultsUnavailable} onClick={this.resultsViewOn}>View Results</Button>
                </Phase0Styles>
            );
        } else {
            return (
                <Phase0Styles style={{ paddingLeft: "10px", paddingRight: "10px" }}>
                    <Button variant="contained" color="primary" style={{ width: '25vw', marginBottom: '2vw' }}
                        onClick={this.resultsViewOff}>Back to Controls</Button>
                    <VotingBlocSummaryDialog data={this.state.vbdtoRows}/>
                    <h5>Election Type: {this.state.electionType} {this.state.electionYear}</h5>
                    <p>Population Thresholds: {this.state.blocPopulationValues[0]}% - {this.state.blocPopulationValues[1]}%<br/>
                    Voting Thresholds: {this.state.blocVotingValues[0]}% - {this.state.blocVotingValues[1]}%</p>
                    <h4>Voting Bloc Precincts</h4>
                    <TableDisplay columns={columns} rows={this.state.vbdtoRows}/>
                </Phase0Styles>
            );
        }
    }
}

const Phase0Styles = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    .label {
      margin-bottom: 2.5vw;
      font-weight: bold;
    }
    .electionLabel {
      font-weight: bold;
    }
    h4 {
        margin-bottom: 2vw;
    }
    p {
        font-weight: bold;
        margin-bottom: 2vw;
    }
`;

const ControlGroup = styled.div`
    width: 80%;
`;

const columns = [
    { id: 'precinctId', label: 'Name', },
    { id: 'demographic', label: 'Demographic', },
    {
        id: 'winningParty',
        label: 'Party',
        format: value => value.toLocaleString(),
    },
    {
        id: 'winningVotes',
        label: 'Winning Votes',
        format: value => value.toLocaleString(),
    },
    {
        id: 'totalVotes',
        label: 'Total Votes',
        format: value => value.toLocaleString(),
    }
];


/*    {
        id: 'population',
        label: 'Population',
        align: 'right',
        format: value => value.toLocaleString(),
    },*/