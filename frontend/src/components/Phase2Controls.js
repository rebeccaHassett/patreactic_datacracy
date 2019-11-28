import React, {Component} from 'react';
import {Button, Form, Row, Tab} from "react-bootstrap";
import SliderControlUpperLowerValues from "./controls/SliderControlUpperLowerValues";
import styled from "styled-components";
import SwitchControl from "./controls/SwitchControl";

export default class Phase2Controls extends Component {
    constructor() {
        super();
        this.handleIncrementalClick = this.handleIncrementalClick.bind(this);
        this.handleRealTimeClick = this.handleRealTimeClick.bind(this);
        this.handleVotePercentage = this.handleVotePercentage.bind(this);
        this.handleContiguity = this.handleContiguity.bind(this);
        this.handleCompactness = this.handleCompactness.bind(this);
        this.handleEqualPopulation = this.handleEqualPopulation.bind(this);
        this.handlePartisanFairness = this.handlePartisanFairness.bind(this);
        this.runPhase2 = this.runPhase2.bind(this);
    }

    state = {
        incremental: false,
        realtime: false,
        votePercentageValues: [],
        compactnessValues: [],
        contiguityValues: [],
        equalPopulationValues: [],
        partisanFairnessValues: [],
    }

    async runPhase2() {
    }

    handleIncrementalClick(evt) {
        this.setState({incremental: evt.target.checked})
    }

    handleRealTimeClick(evt) {
        this.setState({realtime: evt.target.checked})
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
                    <Button onClick={this.runPhase2} style={{width: '20vw', marginBottom: '2vw'}}>Start Phase 2</Button>
                    <SwitchControl name="Incremental" exportIncremental={this.handleIncrementalClick} exportRealTime={this.handleRealTimeClick}/>
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
    position: relative;
    left: 2vw;
    .label {
      margin-bottom: 2.5vw;
      font-weight: bold;
    }
`;