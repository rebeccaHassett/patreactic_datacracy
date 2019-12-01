import React, { Component } from 'react';
import Button from "react-bootstrap/Button";
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
        this.setState({ incremental: evt.target.checked })
    }

    handleRealTimeClick(evt) {
        this.setState({ realtime: evt.target.checked })
    }


    handleVotePercentage(value) {
        this.setState({ votePercentageValues: value })
    }

    handleContiguity(value) {
        this.setState({ contiguityValues: value })
    }

    handleCompactness(value) {
        this.setState({ compactnessValues: value })
    }

    handleEqualPopulation(value) {
        this.setState({ equalPopulationValues: value })
    }

    handlePartisanFairness(value) {
        this.setState({ partisanFairnessValues: value })
    }

    render() {
        return (
            <Phase2Styles>
                <Button onClick={this.runPhase2} style={{ width: '20vw', marginBottom: '2vw' }}>Start Phase 2</Button>
                <SwitchControl name="Incremental" exportIncremental={this.handleIncrementalClick} exportRealTime={this.handleRealTimeClick} />
                <ControlGroup id="votePercentage">
                    <label className="label">Vote Percentage:</label>
                    <SliderControlUpperLowerValues
                        exportState={this.handleVotePercentage}></SliderControlUpperLowerValues>
                </ControlGroup>
                <ControlGroup id="compactness">
                    <label className="label">Compactness Measure:</label>
                    <SliderControlUpperLowerValues
                        exportState={this.handleCompactness}></SliderControlUpperLowerValues>
                </ControlGroup>
                <ControlGroup id="contiguity">
                    <label className="label">Contiguity Measure:</label>
                    <SliderControlUpperLowerValues
                        exportState={this.handleContiguity}></SliderControlUpperLowerValues>
                </ControlGroup>
                <ControlGroup id="equalPopulation">
                    <label className="label">Equal Population Measure:</label>
                    <SliderControlUpperLowerValues
                        exportState={this.handleEqualPopulation}></SliderControlUpperLowerValues>
                </ControlGroup>
                <ControlGroup id="partisanFairness">
                    <label className="label">Partisan Fairness Measure:</label>
                    <SliderControlUpperLowerValues
                        exportState={this.handlePartisanFairness}></SliderControlUpperLowerValues>
                </ControlGroup>
            </Phase2Styles>
        );
    };
}

const Phase2Styles = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    .label {
      margin-bottom: 2.5vw;
      font-weight: bold;
    }
`;

const ControlGroup = styled.div`
    width: 75%;
`;
