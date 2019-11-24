import React, {Component} from 'react';
import {Button, Form, Row, Tab} from "react-bootstrap";
import Slider_Controls from "./SliderControl";
import styled from "styled-components";

export default class Phase1Controls extends Component {
    constructor() {
        super();
        this.runPhase0 = this.runPhase0.bind(this);
        this.handleBlocPopulationUpdate =this.handleBlocPopulationUpdate.bind(this);
        this.handleBlocVotingUpdate =this.handleBlocVotingUpdate.bind(this);

    }

    state = {
        phase1Tab: false,
        blocPopulationValues: [],
        blocVotingValues: [],
    }

    async runPhase0() {
        var phase0Dto = {config: {thresholds: [{name: "blocPopulationThreshold", lower: this.state.blocPopulationValues[0],
                    upper: this.state.blocPopulationValues[1]}, {name: "blocVotingThreshold", lower: this.state.blocVotingValues[0],
                    upper: this.state.blocVotingValues[1]}], weights: [], incremental: false, realtime: false,
                numMajMinDistricts: 0, selectedMinorities: [], year: 2016, type: "congressional"}, state: this.props.state, demographic: ""};

        const response = await fetch("http://127.0.0.1:8080/runPhase0", {
            method: 'POST',
            headers: {'Content-Type': 'application/json' },
            body: JSON.stringify(phase0Dto),
        })
        console.log(await response.json())
    }

    handleBlocPopulationUpdate(value) {
        this.setState({ blocPopulationValues : value })

    }

    handleBlocVotingUpdate(value) {
        this.setState({ blocVotingValues : value })
    }

    render() {
        return (
            <Phase0Styles>
                <Form>
                    <Form.Group>
                        <Form.Label className="label">Block Population Percentage Threshold:</Form.Label>
                        <Slider_Controls exportState={this.handleBlocPopulationUpdate}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label className="label">Block Voting Percentage Threshold:</Form.Label>
                        <Slider_Controls exportState={this.handleBlocVotingUpdate}></Slider_Controls>
                    </Form.Group>
                    <Form.Group id="election-types">
                        <Form.Label>Election Type</Form.Label>
                        <Form.Check aria-label="option 1" label="Congressional 2016"/>
                        <Form.Check aria-label="option 2" label="Congressional 2018"/>
                        <Form.Check aria-label="option 3" label="Presidential 2016"/>
                    </Form.Group>
                </Form>
                <Button onClick={this.runPhase0}>Start Phase 0</Button>
            </Phase0Styles>
        );
    };
}

const Phase0Styles = styled.div`
    .label {
      margin-bottom: 2.5vw;
    }
`;