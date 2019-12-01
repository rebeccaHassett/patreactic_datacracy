import React, { Component } from 'react';
import SliderControlUpperLowerValues from "./controls/SliderControlUpperLowerValues";
import styled from "styled-components";
import Button from '@material-ui/core/Button';
import ElectionButtonsControl from "./controls/ElectionButtonsControl";
import TableDisplay from "./controls/TableDisplay";


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
        resultsInView: false
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

        const response = await fetch("http://127.0.0.1:8080/runPhase0", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(phase0Dto),
        })

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
                        style={{ width: '20vw', marginBottom: '2vw' }}>Start Phase 0</Button>
                    <ControlGroup>
                        <label className="label">Bloc Population Thresholds:</label>
                        <SliderControlUpperLowerValues exportState={this.handleBlocPopulationUpdate} />
                    </ControlGroup>
                    <ControlGroup>
                        <label className="label">Bloc Voting Thresholds:</label>
                        <SliderControlUpperLowerValues exportState={this.handleBlocVotingUpdate} />
                    </ControlGroup>
                    <ControlGroup>
                        <label className="electionLabel">Election Type:</label>
                        <ElectionButtonsControl exportState={this.handleElectionChanges} />
                    </ControlGroup>
                    <Button variant="contained" color="primary" style={{ width: '20vw', marginBottom: '2vw' }}
                        disabled={this.state.resultsUnavailable} onClick={this.resultsViewOn}>View Results</Button>
                </Phase0Styles>
            );
        } else {
            return (
                <Phase0Styles style={{ paddingLeft: "10px", paddingRight: "10px" }}>
                    <Button variant="contained" color="primary" style={{ width: '20vw', marginBottom: '2vw' }}
                        onClick={this.resultsViewOff}>Back</Button>
                    <h5>Election Type: {this.state.electionType} {this.state.electionYear}</h5>
                    <p>Population Thresholds: {this.state.blocPopulationValues[0]}% - {this.state.blocPopulationValues[1]}%<br/>
                    Voting Thresholds: {this.state.blocVotingValues[0]}% - {this.state.blocVotingValues[1]}%</p>
                    <h4>Voting Bloc Precincts</h4>
                    <TableDisplay columns={columns} rows={rows} createData={createData} />
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
    { id: 'precinctName', label: 'Name', },
    { id: 'demographic', label: 'Demographic', },
    {
        id: 'population',
        label: 'Population',
        align: 'right',
        format: value => value.toLocaleString(),
    },
    {
        id: 'winningParty',
        label: 'Winning Party',
        align: 'right',
        format: value => value.toLocaleString(),
    },
    {
        id: 'votes',
        label: 'Votes',
        align: 'right',
        format: value => value.toLocaleString(),
    }
];

function createData(precinctName, demographic, population, winningParty, votes) {
    return { precinctName, demographic, population, winningParty, votes };
}

const rows = [
    createData('Kingstown 1', 'White', 1324171354, 'REP', 123),
];