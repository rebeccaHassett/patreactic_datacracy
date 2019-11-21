import React, {Component} from 'react';
import {Button, Form, Row, Tab} from "react-bootstrap";
import Slider_Controls from "./SliderControl";
import styled from "styled-components";

export default class Phase1Controls extends Component {
    constructor() {
        super();
        this.runPhase0 = this.runPhase0.bind(this);
        this.handleBlocPopulationUpdate =this.handleBlocPopulationUpdate.bind(this);
    }

    state = {
        phase1Tab: false,
        blocPopulationValues: [],
        blocVotingValues: [],
    }

    runPhase0() {
        alert(this.state.values);
    }

    handleBlocPopulationUpdate(value) {
        let blocPopulationValues = this.state.blocPopulationValues;
        blocPopulationValues.push(value);
        this.setState({ blocPopulationValues : blocPopulationValues })
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
                        <Slider_Controls></Slider_Controls>
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