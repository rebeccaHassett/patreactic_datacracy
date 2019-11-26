import React, {Component} from 'react';
import {Button, Form} from "react-bootstrap";
import SliderControlUpperLowerValues from "./controls/SliderControlUpperLowerValues";
import SliderControlSingleValue from "./controls/SliderControlSingleValue";
import styled from "styled-components";

export default class Phase1Controls extends Component {
    constructor() {
        super();
        this.handleNumberCongressionalDistricts = this.handleNumberCongressionalDistricts.bind(this);
        this.handleNumberMajorityMinorityDistricts = this.handleNumberMajorityMinorityDistricts.bind(this);
        this.handleMinorityPopulationThreshold = this.handleMinorityPopulationThreshold.bind(this);
        this.handleIncrementalClick = this.handleIncrementalClick.bind(this);
        this.handleRealTimeClick = this.handleRealTimeClick.bind(this);
    }

    state = {
        numCongressionalDistricts: 0,
        numMajorityMinorityDistricts: 0,
        minorityPopulationThresholdValues: [],
        incremental: false,
        realtime: false,
        selectedMinorities: []
    }

    async runPhase1() {
        var phase1Dto = {
            config: {
                thresholds: [{
                    name: "minorityPopulationThresholds",
                    lower: this.state.minorityPopulationThresholdValues[0],
                    upper: this.state.minorityPopulationThresholdValues[1]
                }], weights: {},
                incremental: this.state.incremental, realtime: this.state.realtime,
                numDistricts: this.state.numCongressionalDistricts,
                numMajMinDistricts: this.state.numMajorityMinorityDistricts, selectedMinorities: [],
                year: this.state.electionYear, type: this.state.electionType
            }, state: this.props.state,
            demographic: ""
        };

        const response = await fetch("http://127.0.0.1:8080/runPhase1", {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(phase1Dto),
        })
    }

    handleNumberCongressionalDistricts(value) {
        this.setState({numCongressionalDistricts: value})
    }

    handleNumberMajorityMinorityDistricts(value) {
        this.setState({numMajorityMinorityDistricts: value})
    }

    handleMinorityPopulationThreshold(value) {
        this.setState({minorityPopulationThresholdValues: value})
    }

    handleIncrementalClick(evt) {
        this.setState({incremental: evt.target.checked})
    }

    handleRealTimeClick(evt) {
        this.setState({realtime: evt.target.checked})
    }

    render() {
        return (
            <Phase1Styles>
                <Form>
                    <Button id="btn">Start Phase 1</Button>
                    <Form.Group id="incremental">
                        <Form.Check onChange={this.handleIncrementalClick} label="Incremental"/>
                        <Form.Check onChange={this.handleRealTimeClick} label="RealTime"/>
                    </Form.Group>
                    <Form.Group id="numberDistricts">
                        <Form.Label className="label">Number of Congressional Districts:</Form.Label>
                        <SliderControlSingleValue
                            exportState={this.handleNumberCongressionalDistricts}></SliderControlSingleValue>
                    </Form.Group>
                    <Form.Group id="majorityMinorityDistricts">
                        <Form.Label className="label">Number of Majority-Minority Districts</Form.Label>
                        <SliderControlSingleValue
                            exportState={this.handleNumberMajorityMinorityDistricts}></SliderControlSingleValue>
                    </Form.Group>
                    <Form.Group id="ethnicGroups">
                        <Form.Label>Ethnic/Racial Groups:</Form.Label>
                        <Form.Check label="African American"/>
                        <Form.Check label="Asian"/>
                        <Form.Check label="Hispanic"/>
                        <Form.Check label="White"/>
                        <Form.Check label="Native American"/>
                        <Form.Check label="Pacific Islander"/>
                    </Form.Group>
                    <Form.Group id="minorityPopulationThreshold">
                        <Form.Label className="label">Minority Population Thresholds:</Form.Label>
                        <SliderControlUpperLowerValues
                            exportState={this.handleMinorityPopulationThreshold}></SliderControlUpperLowerValues>
                    </Form.Group>
                </Form>
            </Phase1Styles>
        );
    };
}

const Phase1Styles = styled.div`
    .label {
      margin-bottom: 2.5vw;
    }
`;