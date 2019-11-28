import React, {Component} from 'react';
import {Form} from "react-bootstrap";
import SliderControlUpperLowerValues from "./controls/SliderControlUpperLowerValues";
import styled from "styled-components";
import ModalControl from './controls/ModalControl';
import Button from '@material-ui/core/Button';
import ElectionButtonsControl from "./controls/ElectionButtonsControl";

export default class Phase0Controls extends Component {

    constructor() {
        super();
        this.runPhase0 = this.runPhase0.bind(this);
        this.handleBlocPopulationUpdate = this.handleBlocPopulationUpdate.bind(this);
        this.handleBlocVotingUpdate = this.handleBlocVotingUpdate.bind(this);
        this.handleElectionChanges = this.handleElectionChanges.bind(this);
    }


    state = {
        phase1Tab: false,
        blocPopulationValues: [],
        blocVotingValues: [],
        electionType: 'Presidential',
        electionYear: '2016',
        button2018: true
    }

    async runPhase0() {
        var phase0Dto = {
            config: {
                thresholds: {
                    BLOC_POP_PERCENTAGE: {
                        lower: this.state.blocPopulationValues[0],
                        upper: this.state.blocPopulationValues[1]
                    },
                    BLOC_VOTING_PERCENTAGE: {
                        lower: this.state.blocVotingValues[0],
                        upper: this.state.blocVotingValues[1]
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
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(phase0Dto),
        })
    }

    handleBlocPopulationUpdate(value) {
        this.setState({blocPopulationValues: value})

    }

    handleBlocVotingUpdate(value) {
        this.setState({blocVotingValues: value})
    }

    handleElectionChanges(event) {
        if(event.target.value  === "Congressional 2016") {
            this.setState({
                election: 'Congressional 2016'
            })
            this.setState({
                electionYear: '2016'
            })
            this.setState({
                electionType: 'Congressional'
            })
        }
        else if(event.target.value  === "Congressional 2018") {
            this.setState({
                election: 'Congressional 2018'
            })
            this.setState({
                electionYear: '2018'
            })
            this.setState({
                electionType: 'Congressional'
            })
        }
        else if(event.target.value  === "Presidential 2016") {
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
        return (
            <Phase0Styles>
                <Form>
                    <Button variant="contained" color="primary" onClick={this.runPhase0} style={{width: '20vw', marginBottom: '2vw'}}>Start Phase 0</Button>
                    <Form.Group>
                        <Form.Label className="label">Bloc Population Thresholds:</Form.Label>
                        <SliderControlUpperLowerValues exportState={this.handleBlocPopulationUpdate}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label className="label">Bloc Voting Thresholds:</Form.Label>
                        <SliderControlUpperLowerValues exportState={this.handleBlocVotingUpdate}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label className="electionLabel">Election Type:</Form.Label>
                    <ElectionButtonsControl exportState={this.handleElectionChanges}/>
                    </Form.Group>
                    <ModalControl></ModalControl>
                </Form>
            </Phase0Styles>
        );
    };
}

const Phase0Styles = styled.div`
    position: relative;
    left: 2vw;
    .label {
      margin-bottom: 2.5vw;
      font-weight: bold;
    }
    .electionLabel {
      font-weight: bold;
    }
    .vbdtoTable {
        background-color: dodgerblue;
        margin-top: 4vw;
        font-size: 0.8vw;
        padding-right: 0vw;
        margin-right: 0vw;
    }
`;