import React, { Component } from 'react';
import Button from "react-bootstrap/Button";
import SliderControlUpperLowerValues from "./controls/SliderControlUpperLowerValues";
import styled from "styled-components";
import SwitchControl from "./controls/SwitchControl";
import SliderControlSingleValue from "./controls/SliderControlSingleValue";

export default class Phase2Controls extends Component {
    constructor() {
        super();
        this.handleIncrementalClick = this.handleIncrementalClick.bind(this);
        this.handleRealTimeClick = this.handleRealTimeClick.bind(this);
        this.handleEfficiencyGap = this.handleEfficiencyGap.bind(this);
        this.handleConvexHullCompactness = this.handleConvexHullCompactness.bind(this);
        this.handleEdgeCompactness = this.handleEdgeCompactness.bind(this);
        this.handleReockCompactness = this.handleReockCompactness.bind(this);
        this.handlePopulationEquality = this.handlePopulationEquality.bind(this);
        this.handlePartisanFairness = this.handlePartisanFairness.bind(this);
        this.handleCompetitiveness = this.handleCompetitiveness.bind(this);
        this.handleGerrymanderRepublican = this.handleGerrymanderRepublican.bind(this);
        this.handlePopulationHomogeneity = this.handlePopulationHomogeneity.bind(this);
        this.handleGerrymanderDemocrat = this.handleGerrymanderDemocrat.bind(this);
        this.handleEfficiencyGapWeight = this.handleEfficiencyGapWeight.bind(this);
        this.handleConvexHullCompactnessWeight = this.handleConvexHullCompactnessWeight.bind(this);
        this.handleEdgeCompactnessWeight = this.handleEdgeCompactnessWeight.bind(this);
        this.handleReockCompactnessWeight = this.handleReockCompactnessWeight.bind(this);
        this.handlePopulationEqualityWeight = this.handlePopulationEqualityWeight.bind(this);
        this.handlePartisanFairnessWeight = this.handlePartisanFairnessWeight.bind(this);
        this.handleCompetitivenessWeight = this.handleCompetitivenessWeight.bind(this);
        this.handleGerrymanderRepublicanWeight = this.handleGerrymanderRepublicanWeight.bind(this);
        this.handlePopulationHomogeneityWeight = this.handlePopulationHomogeneityWeight.bind(this);
        this.handleGerrymanderDemocratWeight = this.handleGerrymanderDemocratWeight.bind(this);
        this.runPhase2 = this.runPhase2.bind(this);
    }

    state = {
        incremental: false,
        realtime: false,
        convexHullCompactnessValues: [],
        edgeCompactnessValues: [],
        reockCompactnessValues: [],
        efficiencyGapValues: [],
        populationEqualityValues: [],
        partisanFairnessValues: [],
        competitivenessValues: [],
        gerrymanderRepublicanValues: [],
        populationHomogeneityValues: [],
        gerrymanderDemocratValues: [],
        convexHullCompactnessWeightValue: 1,
        edgeCompactnessWeightValue: 1,
        reockCompactnessWeightValue: 1,
        efficiencyGapWeightValue: 1,
        populationEqualityWeightValue: 1,
        partisanFairnessWeightValue: 1,
        competitivenessWeightValue: 1,
        gerrymanderRepublicanWeightValue: 1,
        populationHomogeneityWeightValue: 1,
        gerrymanderDemocratWeightValue: 1,
    }

    async runPhase2() {
    }

    handleIncrementalClick(evt) {
        this.setState({ incremental: evt.target.checked })
    }

    handleRealTimeClick(evt) {
        this.setState({ realtime: evt.target.checked })
    }


    handleEdgeCompactness(value) {
        this.setState({ edgeCompactnessValues: value })
    }

    handleEdgeCompactnessWeight(value) {
        this.setState({ edgeCompactnessWeightValue: value })
    }

    handleConvexHullCompactness(value) {
        this.setState({ convexHullCompactnessValues: value })
    }

    handleConvexHullCompactnessWeight(value) {
        this.setState({ convexHullCompactnessWeightValue: value })
    }

    handleEfficiencyGap(value) {
        this.setState({ efficiencyGapValues: value })
    }

    handleEfficiencyGapWeight(value) {
        this.setState({ efficiencyGapWeightValue: value })
    }

    handleReockCompactness(value) {
        this.setState({ reockCompactnessValues: value })
    }

    handleReockCompactnessWeight(value) {
        this.setState({ reockCompactnessWeightValue: value })
    }

    handlePopulationEquality(value) {
        this.setState({ populationEqualityValues: value })
    }

    handlePopulationEqualityWeight(value) {
        this.setState({ populationEqualityWeightValue: value })
    }

    handlePartisanFairness(value) {
        this.setState({ partisanFairnessValues: value })
    }

    handlePartisanFairnessWeight(value) {
        this.setState({ partisanFairnessWeightValue: value })
    }

    handleCompetitiveness(value) {
        this.setState({ competitivenessValues: value })
    }

    handleCompetitivenessWeight(value) {
        this.setState({ competitivenessWeightValue: value })
    }

    handleGerrymanderRepublican(value) {
        this.setState({ gerrymanderRepublicanValues: value })
    }

    handleGerrymanderRepublicanWeight(value) {
        this.setState({ gerrymanderRepublicanWeightValue: value })
    }

    handleGerrymanderDemocrat(value) {
        this.setState({ gerrymanderDemocratValues: value })
    }

    handleGerrymanderDemocratWeight(value) {
        this.setState({ gerrymanderDemocratWeightValue: value })
    }

    handlePopulationHomogeneity(value) {
        this.setState({ populationHomogeneityValues: value })
    }

    handlePopulationHomogeneityWeight(value) {
        this.setState({ populationHomogeneityWeightValue: value })
    }


    render() {
        return (
            <Phase2Styles>
                <Button onClick={this.runPhase2} style={{ width: '20vw', marginBottom: '2vw' }}>Start Phase 2</Button>
                <SwitchControl name="Incremental" exportIncremental={this.handleIncrementalClick} exportRealTime={this.handleRealTimeClick} />
                <ControlGroup>
                    <label className="label">Convex Hull Compactness Thresholds:</label>
                    <SliderControlUpperLowerValues
                        exportState={this.handleConvexHullCompactness}></SliderControlUpperLowerValues>
                </ControlGroup>
                <ControlGroup>
                    <label className="label">Convex Hull Compactness Weighting:</label>
                    <SliderControlSingleValue min={0} max={1} step={0.01}
                                              exportState={this.handleConvexHullCompactnessWeight}></SliderControlSingleValue>
                </ControlGroup>
                <ControlGroup>
                    <label className="label">Reock Compactness Thresholds:</label>
                    <SliderControlUpperLowerValues
                        exportState={this.handleReockCompactness}></SliderControlUpperLowerValues>
                </ControlGroup>
                <ControlGroup>
                    <label className="label">Reock Compactness Weighting:</label>
                    <SliderControlSingleValue min={0} max={1} step={0.01}
                                              exportState={this.handleReockCompactnessWeight}></SliderControlSingleValue>
                </ControlGroup>
                <ControlGroup>
                    <label className="label">Edge Compactness Thresholds:</label>
                    <SliderControlUpperLowerValues
                        exportState={this.handleEdgeCompactness}></SliderControlUpperLowerValues>
                </ControlGroup>
                <ControlGroup>
                    <label className="label">Edge Compactness Weighting:</label>
                    <SliderControlSingleValue min={0} max={1} step={0.01}
                                              exportState={this.handleEdgeCompactnessWeight}></SliderControlSingleValue>
                </ControlGroup>
                <ControlGroup>
                    <label className="label">Efficiency Gap Thresholds:</label>
                    <SliderControlUpperLowerValues
                        exportState={this.handleEfficiencyGap}></SliderControlUpperLowerValues>
                </ControlGroup>
                <ControlGroup>
                    <label className="label">Efficiency Gap Weighting:</label>
                    <SliderControlSingleValue min={0} max={1} step={0.01}
                                              exportState={this.handleEfficiencyGapWeight}></SliderControlSingleValue>
                </ControlGroup>
                <ControlGroup>
                    <label className="label">Population Homogeneity Thresholds:</label>
                    <SliderControlUpperLowerValues
                        exportState={this.handlePopulationHomogeneity}></SliderControlUpperLowerValues>
                </ControlGroup>
                <ControlGroup>
                    <label className="label">Population Homogeneity Weighting:</label>
                    <SliderControlSingleValue min={0} max={1} step={0.01}
                                              exportState={this.handlePopulationHomogeneityWeight}></SliderControlSingleValue>
                </ControlGroup>
                <ControlGroup>
                    <label className="label">Population Equality Thresholds:</label>
                    <SliderControlUpperLowerValues
                        exportState={this.handlePopulationEquality}></SliderControlUpperLowerValues>
                </ControlGroup>
                <ControlGroup>
                    <label className="label">Population Equality Weighting:</label>
                    <SliderControlSingleValue min={0} max={1} step={0.01}
                                              exportState={this.handlePopulationEqualityWeight}></SliderControlSingleValue>
                </ControlGroup>
                <ControlGroup>
                    <label className="label">Partisan Fairness Thresholds:</label>
                    <SliderControlUpperLowerValues
                        exportState={this.handlePartisanFairness}></SliderControlUpperLowerValues>
                </ControlGroup>
                <ControlGroup>
                    <label className="label">Partisan Fairness Weighting:</label>
                    <SliderControlSingleValue min={0} max={1} step={0.01}
                                              exportState={this.handlePartisanFairnessWeight}></SliderControlSingleValue>
                </ControlGroup>
                <ControlGroup>
                    <label className="label">Competitiveness Thresholds:</label>
                    <SliderControlUpperLowerValues
                        exportState={this.handleCompetitiveness}></SliderControlUpperLowerValues>
                </ControlGroup>
                <ControlGroup>
                    <label className="label">Competitiveness Weighting:</label>
                    <SliderControlSingleValue min={0} max={1} step={0.01}
                                              exportState={this.handleCompetitivenessWeight}></SliderControlSingleValue>
                </ControlGroup>
                <ControlGroup>
                    <label className="label">Gerrymander Republican Thresholds:</label>
                    <SliderControlUpperLowerValues
                        exportState={this.handleGerrymanderRepublican}></SliderControlUpperLowerValues>
                </ControlGroup>
                <ControlGroup>
                    <label className="label">Gerrymander Republican Weighting:</label>
                    <SliderControlSingleValue min={0} max={1} step={0.01}
                                              exportState={this.handleGerrymanderRepublicanWeight}></SliderControlSingleValue>
                </ControlGroup>
                <ControlGroup>
                    <label className="label">Gerrymander Democrat Thresholds:</label>
                    <SliderControlUpperLowerValues
                        exportState={this.handleGerrymanderDemocrat}></SliderControlUpperLowerValues>
                </ControlGroup>
                <ControlGroup>
                    <label className="label">Gerrymander Democrat Weighting:</label>
                    <SliderControlSingleValue min={0} max={1} step={0.01}
                                              exportState={this.handleGerrymanderDemocratWeight}></SliderControlSingleValue>
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
      margin-top: 2vw;
    }
`;

const ControlGroup = styled.div`
    width: 75%;
`;
