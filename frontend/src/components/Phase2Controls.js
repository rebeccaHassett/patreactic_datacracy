import React, { Component } from 'react';
import SliderControlUpperLowerValues from "./controls/SliderControlUpperLowerValues";
import styled from "styled-components";
import SwitchControl from "./controls/SwitchControl";
import SliderControlSingleValue from "./controls/SliderControlSingleValue";
import Button from "@material-ui/core/Button";

export default class Phase2Controls extends Component {
    constructor() {
        super();
        this.handleIncrementalClick = this.handleIncrementalClick.bind(this);
        this.handleRealTimeClick = this.handleRealTimeClick.bind(this);
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

    handleEdgeCompactnessWeight(value) {
        this.setState({ edgeCompactnessWeightValue: value })
    }

    handleConvexHullCompactnessWeight(value) {
        this.setState({ convexHullCompactnessWeightValue: value })
    }

    handleEfficiencyGapWeight(value) {
        this.setState({ efficiencyGapWeightValue: value })
    }

    handleReockCompactnessWeight(value) {
        this.setState({ reockCompactnessWeightValue: value })
    }

    handlePopulationEqualityWeight(value) {
        this.setState({ populationEqualityWeightValue: value })
    }

    handlePartisanFairnessWeight(value) {
        this.setState({ partisanFairnessWeightValue: value })
    }

    handleCompetitivenessWeight(value) {
        this.setState({ competitivenessWeightValue: value })
    }

    handleGerrymanderRepublicanWeight(value) {
        this.setState({ gerrymanderRepublicanWeightValue: value })
    }

    handleGerrymanderDemocratWeight(value) {
        this.setState({ gerrymanderDemocratWeightValue: value })
    }

    handlePopulationHomogeneityWeight(value) {
        this.setState({ populationHomogeneityWeightValue: value })
    }


    render() {
        return (
            <Phase2Styles>
                <Button  variant="contained" color="primary" onClick={this.runPhase2} style={{ width: '25vw', marginBottom: '2vw' }}>Start Phase 2</Button>
                <SwitchControl name="Incremental" exportIncremental={this.handleIncrementalClick} exportRealTime={this.handleRealTimeClick} />
                <ControlGroup>
                    <label className="label">Convex Hull Compactness Weighting:</label>
                    <SliderControlSingleValue min={0} max={1} step={0.01} marks={OFMarks}
                                              exportState={this.handleConvexHullCompactnessWeight}/>
                </ControlGroup>
                <ControlGroup>
                    <label className="label">Reock Compactness Weighting:</label>
                    <SliderControlSingleValue min={0} max={1} step={0.01} marks={OFMarks}
                                              exportState={this.handleReockCompactnessWeight}/>
                </ControlGroup>
                <ControlGroup>
                    <label className="label">Edge Compactness Weighting:</label>
                    <SliderControlSingleValue min={0} max={1} step={0.01} marks={OFMarks}
                                              exportState={this.handleEdgeCompactnessWeight}/>
                </ControlGroup>
                <ControlGroup>
                    <label className="label">Efficiency Gap Weighting:</label>
                    <SliderControlSingleValue min={0} max={1} step={0.01} marks={OFMarks}
                                              exportState={this.handleEfficiencyGapWeight}/>
                </ControlGroup>
                <ControlGroup>
                    <label className="label">Population Homogeneity Weighting:</label>
                    <SliderControlSingleValue min={0} max={1} step={0.01} marks={OFMarks}
                                              exportState={this.handlePopulationHomogeneityWeight}/>
                </ControlGroup>
                <ControlGroup>
                    <label className="label">Population Equality Weighting:</label>
                    <SliderControlSingleValue min={0} max={1} step={0.01} marks={OFMarks}
                                              exportState={this.handlePopulationEqualityWeight}/>
                </ControlGroup>
                <ControlGroup>
                    <label className="label">Partisan Fairness Weighting:</label>
                    <SliderControlSingleValue min={0} max={1} step={0.01} marks={OFMarks}
                                              exportState={this.handlePartisanFairnessWeight}/>
                </ControlGroup>
                <ControlGroup>
                    <label className="label">Competitiveness Weighting:</label>
                    <SliderControlSingleValue min={0} max={1} step={0.01} marks={OFMarks}
                                              exportState={this.handleCompetitivenessWeight}/>
                </ControlGroup>
                <ControlGroup>
                    <label className="label">Gerrymander Republican Weighting:</label>
                    <SliderControlSingleValue min={0} max={1} step={0.01} marks={OFMarks}
                                              exportState={this.handleGerrymanderRepublicanWeight}/>
                </ControlGroup>
                <ControlGroup>
                    <label className="label">Gerrymander Democrat Weighting:</label>
                    <SliderControlSingleValue min={0} max={1} step={0.01} marks={OFMarks}
                                              exportState={this.handleGerrymanderDemocratWeight}/>
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

const OFMarks =  [
    {
        value: 0,
        label: '0',
    },
    {
        value: 1,
        label: '1',
    },
];