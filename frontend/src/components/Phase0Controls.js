import React, {Component} from 'react';
import {Button, Form, ButtonGroup} from "react-bootstrap";
import SliderControlUpperLowerValues from "./controls/SliderControlUpperLowerValues";
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import styled from "styled-components";
import ModalControl from './controls/ModalControl';

export default class Phase0Controls extends Component {

    constructor() {
        super();
        this.runPhase0 = this.runPhase0.bind(this);
        this.handleBlocPopulationUpdate = this.handleBlocPopulationUpdate.bind(this);
        this.handleBlocVotingUpdate = this.handleBlocVotingUpdate.bind(this);
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


    _onElectionTypeChange(option) {
        if (option === "Congressional") {
            this.setState({
                button2018: false
            });
        } else {
            this.setState({
                button2018: true
            });
            this.setState({
                electionYear: '2016'
            })
        }
        this.setState({
            electionType: option
        });
    }

    _onElectionYearChange(option) {
        this.setState({
            electionYear: option
        });
    }

    render() {
        return (
            <Phase0Styles>
                <Form>
                    <Button onClick={this.runPhase0}>Start Phase 0</Button>
                    <Form.Group>
                        <Form.Label className="label">Bloc Population Thresholds:</Form.Label>
                        <SliderControlUpperLowerValues exportState={this.handleBlocPopulationUpdate}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label className="label">Bloc Voting Thresholds:</Form.Label>
                        <SliderControlUpperLowerValues
                            exportState={this.handleBlocVotingUpdate}></SliderControlUpperLowerValues>
                    </Form.Group>
                    <h3>Election Type</h3>
                    <ButtonGroup>
                        <Button onClick={this._onElectionTypeChange.bind(this, 'Congressional')}
                                active={this.state.electionType === 'Congressional'}
                                className="electionButton">Congressional</Button>
                        <Button onClick={this._onElectionTypeChange.bind(this, 'Presidential')}
                                active={this.state.electionType === 'Presidential'}
                                className="electionButton">Presidential</Button>
                    </ButtonGroup>
                    <ButtonGroup>
                        <Button onClick={this._onElectionYearChange.bind(this, '2016')}
                                active={this.state.electionYear === '2016'} className="electionButton">2016</Button>
                        <Button onClick={this._onElectionYearChange.bind(this, '2018')}
                                active={this.state.electionYear === '2018'} className="electionButton">2018</Button>
                    </ButtonGroup>
                    <ModalControl></ModalControl>
                </Form>
            </Phase0Styles>
        );
    };
}

const Phase0Styles = styled.div`
    .label {
      margin-bottom: 2.5vw;
    }
    .electionButton {
        width: 10vw;
        background-color: #585858;
        margin-top: 0vw;
        margin-bottom: 0vw;
    }

    .electionButton:active {
        background-color:olive;
    }
    Button:focus{
        background:olive;
    }
    .vbdtoTable {
        background-color: dodgerblue;
        margin-top: 4vw;
        font-size: 0.8vw;
        padding-right: 0vw;
        margin-right: 0vw;
    }
`;