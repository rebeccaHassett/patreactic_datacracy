import React, {Component} from 'react';
import {Button, Form} from "react-bootstrap";
import SliderControlUpperLowerValues from "./controls/SliderControlUpperLowerValues";
import SliderControlSingleValue from "./controls/SliderControlSingleValue";
import styled from "styled-components";

export default class Phase1Controls extends Component {
    constructor() {
        super();
        this.handleNumberCongressionalDistricts =this.handleNumberCongressionalDistricts.bind(this);
        this.handleNumberMajorityMinorityDistricts =this.handleNumberMajorityMinorityDistricts.bind(this);
        this.handleMinorityPopulationThreshold = this.handleMinorityPopulationThreshold.bind(this);
    }

    state = {
        numCongressionalDistricts: 0,
        numMajorityMinorityDistricts: 0,
        minorityPopulationThresholdValues: []
    }

    handleNumberCongressionalDistricts(value) {
        this.setState({ numCongressionalDistricts : value })
    }
    handleNumberMajorityMinorityDistricts(value) {
        this.setState({ numMajorityMinorityDistricts : value })
    }
    handleMinorityPopulationThreshold(value) {
        this.setState({ minorityPopulationThresholdValues : value })
    }

    render() {
        return (
            <Phase1Styles>
            <Form>
                <Button id = "btn">Start Phase 1</Button>
                <Form.Group id="incremental">
                    <Form.Check label="Incremental"/>
                </Form.Group>
                <Form.Group id="numberDistricts">
                    <Form.Label className="label">Number of Congressional Districts:</Form.Label>
                    <SliderControlSingleValue exportState={this.handleNumberCongressionalDistricts}></SliderControlSingleValue>
                </Form.Group>
                <Form.Group id="majorityMinorityDistricts">
                    <Form.Label className="label">Number of Majority-Minority Districts</Form.Label>
                    <SliderControlSingleValue exportState={this.handleNumberMajorityMinorityDistricts}></SliderControlSingleValue>
                </Form.Group>
                <Form.Group id="ethnicGroups">
                    <Form.Label>Ethnic/Racial Groups:</Form.Label>
                    <Form.Check aria-label="option 1" label="African American"/>
                    <Form.Check aria-label="option 1" label="Asian"/>
                    <Form.Check aria-label="option 1" label="Hispanic"/>
                </Form.Group>
                <Form.Group id="minorityPopulationThreshold">
                    <Form.Label className="label">Minority Population Upper Threshold:</Form.Label>
                    <SliderControlUpperLowerValues exportState={this.handleMinorityPopulationThreshold}></SliderControlUpperLowerValues>
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