import React, {Component} from 'react';
import {Button, Form, Row, Tab} from "react-bootstrap";
import SliderControlUpperLowerValues from "./controls/SliderControlUpperLowerValues";
import styled from "styled-components";

export default class Phase2Controls extends Component {
    constructor() {
        super();
        this.handleVotePercentage = this.handleVotePercentage.bind(this);
        this.handleContiguity = this.handleContiguity.bind(this);
        this.handleCompactness = this.handleCompactness.bind(this);
        this.handleEqualPopulation = this.handleEqualPopulation.bind(this);
        this.handlePartisanFairness = this.handlePartisanFairness.bind(this);
    }

    state = {
        votePercentageValues: [],
        compactnessValues: [],
        contiguityValues: [],
        equalPopulationValues: [],
        partisanFairnessValues: []
    }

    handleVotePercentage(value) {
        this.setState({votePercentageValues: value})
    }

    handleContiguity(value) {
        this.setState({contiguityValues: value})
    }

    handleCompactness(value) {
        this.setState({compactnessValues: value})
    }

    handleEqualPopulation(value) {
        this.setState({equalPopulationValues: value})
    }

    handlePartisanFairness(value) {
        this.setState({partisanFairnessValues: value})
    }

    render() {
        return (
            <Phase2Styles>
                <Form>
                    <Button id="btn">Start Phase 2</Button>
                    <Form.Group id="incremental">
                        <Form.Check label="Incremental"/>
                    </Form.Group>
                    <Form.Group id="ethnicGroups">
                        <Form.Label>Ethnic/Racial Groups:</Form.Label>
                        <Form.Check aria-label="option 1" label="African American"/>
                        <Form.Check aria-label="option 1" label="Asian"/>
                        <Form.Check aria-label="option 1" label="Hispanic"/>
                    </Form.Group>
                    <Form.Group id="votePercentage">
                        <Form.Label className="label">Vote Percentage:</Form.Label>
                        <SliderControlUpperLowerValues
                            exportState={this.handleVotePercentage}></SliderControlUpperLowerValues>
                    </Form.Group>
                    <Form.Group id="compactness">
                        <Form.Label className="label">Compactness Measure:</Form.Label>
                        <SliderControlUpperLowerValues
                            exportState={this.handleCompactness}></SliderControlUpperLowerValues>
                    </Form.Group>
                    <Form.Group id="contiguity">
                        <Form.Label className="label">Contiguity Measure:</Form.Label>
                        <SliderControlUpperLowerValues
                            exportState={this.handleContiguity}></SliderControlUpperLowerValues>
                    </Form.Group>
                    <Form.Group id="equalPopulation">
                        <Form.Label className="label">Equal Population Measure:</Form.Label>
                        <SliderControlUpperLowerValues
                            exportState={this.handleEqualPopulation}></SliderControlUpperLowerValues>
                    </Form.Group>
                    <Form.Group id="partisanFairness">
                        <Form.Label className="label">Partisan Fairness Measure:</Form.Label>
                        <SliderControlUpperLowerValues
                            exportState={this.handlePartisanFairness}></SliderControlUpperLowerValues>
                    </Form.Group>
                </Form>
            </Phase2Styles>
        );
    };
}

const Phase2Styles = styled.div`
    .label {
      margin-bottom: 2.5vw;
    }
`;