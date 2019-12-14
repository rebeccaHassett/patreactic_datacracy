import React, {Component} from 'react';
import styled from "styled-components";
import SliderControlSingleValue from "./controls/SliderControlSingleValue";
import Button from "@material-ui/core/Button";
import TableDisplay from "./controls/TableDisplay";
import RunControls from "./controls/RunControls";

export default class Phase2Controls extends Component {
    constructor() {
        super();
        this.handleIncrementalClick = this.handleIncrementalClick.bind(this);
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
        incremental: true,
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
        resultsInView: false,
        phase2RunButtonDisabled: false,
        phase2ControlsDisabled: false,
        phase2ButtonText: "Start Phase 2"
    };

    async runPhase2() {
        this.setState({phase2RunButtonDisabled: true});
        this.setState({phase2ControlsDisabled: true});
        this.props.togglePhase1Lock(true);

        let normalizedCompetitiveness = 0.1;
        let normalizedPopulationHomogeneity = 0.1;
        let normalizedGerrymanderDemocrat = 0.1;
        let normalizedGerrymanderRepublican = 0.1;
        let normalizedPopulationEquality = 0.1;
        let normalizedEdgeCompactness = 0.1;
        let normalizedEfficiencyGap = 0.1;
        let normalizedReockCompactness = 0.1;
        let normalizedConvexHullCompactness = 0.1;
        let normalizedPartisanFairness = 0.1;

        /*Normalize Weights:
            Divide each number by the sum of all numbers [if sum is 0, set each number to 0.1 since each weighting]*/
        let sum = this.state.competitivenessWeightValue + this.state.populationHomogeneityWeightValue + this.state.gerrymanderDemocratWeightValue
            + this.state.gerrymanderRepublicanWeightValue + this.state.populationEqualityWeightValue
            + this.state.edgeCompactnessWeightValue + this.state.efficiencyGapWeightValue
            + this.state.reockCompactnessWeightValue + this.state.convexHullCompactnessWeightValue
            + this.state.partisanFairnessWeightValue;

        if (sum !== 0) {
            normalizedCompetitiveness = this.state.competitivenessWeightValue / sum;
            normalizedPopulationHomogeneity = this.state.populationHomogeneityWeightValue / sum;
            normalizedGerrymanderDemocrat = this.state.gerrymanderDemocratWeightValue / sum;
            normalizedGerrymanderRepublican = this.state.gerrymanderRepublicanWeightValue / sum;
            normalizedPopulationEquality = this.state.populationEqualityWeightValue / sum;
            normalizedEdgeCompactness = this.state.edgeCompactnessWeightValue / sum;
            normalizedEfficiencyGap = this.state.efficiencyGapWeightValue / sum;
            normalizedReockCompactness = this.state.reockCompactnessWeightValue / sum;
            normalizedConvexHullCompactness = this.state.convexHullCompactnessWeightValue / sum;
            normalizedPartisanFairness = this.state.partisanFairnessWeightValue / sum;
        }

        var phase2Dto = {
            weights: {
                "PARTISAN_FAIRNESS": normalizedPartisanFairness,
                "REOCK_COMPACTNESS": normalizedReockCompactness,
                "CONVEX_HULL_COMPACTNESS": normalizedConvexHullCompactness,
                "EDGE_COMPACTNESS": normalizedEdgeCompactness,
                "EFFICIENCY_GAP": normalizedEfficiencyGap,
                "POPULATION_EQUALITY": normalizedPopulationEquality,
                "COMPETITIVENESS": normalizedCompetitiveness,
                "GERRYMANDER_REPUBLICAN": normalizedGerrymanderRepublican,
                "POPULATION_HOMOGENEITY": normalizedPopulationHomogeneity,
                "GERRYMANDER_DEMOCRAT": normalizedGerrymanderDemocrat
            },
            incremental: this.state.incremental,
            realtime: this.state.realtime,
        };

        let that = this;
        await fetch("http://127.0.0.1:8080/phase2/start", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Origin': 'http://localhost:3000'
            },
            body: JSON.stringify(phase2Dto),
            credentials: 'include',
        }).then(function (response) {
            if (response.status >= 400) {
                throw new Error("Failed to load phase2 data from server");
            }
            return response.json();
        }).then(function (data) {

            that.phase2Update(data);

            if (that.state.incremental) {
                that.setState({phase2ButtonText: "Update Phase 2"});
            }

            if (that.state.incremental) {
                that.setState({phase2RunButtonDisabled: false});
            } else {
                if (that.state.realtime) {
                    that.pollPhase2NonIncrementalRealtime(); //update each iteration
                } else {
                    that.pollPhase2NonIncrementalUpdateEnd(); //update only at the end
                }
            }
        });
    }

    phase2Update(data) {
        let objFuncResults = {
            convexHullCompactness: data.convexHullCompactness,
            edgeCompactness: data.edgeCompactness,
            reockCompactness: data.reockCompactness,
            efficiencyGap: data.efficiencyGap,
            populationEquality: data.populationEquality,
            partisanFairness: data.partisanFairness,
            competitiveness: data.competitiveness,
            gerrymanderRepublican: data.gerrymanderRepublican,
            populationHomogeneity: data.populationHomogeneity,
            gerrymanderDemocrat: data.gerrymanderDemocrat
        };
        this.props.phase2Update(data, objFuncResults);
    }

    async pollPhase2NonIncrementalRealtime() {
        let that = this;
        fetch("http://127.0.0.1:8080/phase2/poll").then(function (response) {
            if (response.status >= 400) {
                throw new Error("Failed to load phase 2 update from server");
            }
            return response.json();
        }).then(function (data) {
            if (data.moves === []) {
                that.endPhase2();
            } else {
                that.props.phase2Update(data);
                that.pollPhase2NonIncremental();
            }
        });
    }

    async pollPhase2NonIncrementalUpdateEnd() {
        let that = this;
        fetch("http://127.0.0.1:8080/phase2/complete").then(function (response) {
            if (response.status >= 400) {
                throw new Error("Failed to load phase 2 update from server");
            }
            return response.json();
        }).then(function (data) {
            that.props.phase2Update(data);
            that.endPhase2();
        });
    }

    async pollPhase2Incremental() {
        this.setState({phase2RunButtonDisabled: true});
        let that = this;
        fetch("http://127.0.0.1:8080/phase2/poll", {
            headers: {'Access-Control-Allow-Credentials': true, 'Access-Control-Allow-Origin': 'http://localhost:3000'},
            credentials: 'include'
        }).then(function (response) {
            if (response.status >= 400) {
                throw new Error("Failed to load phase 2 update from server");
            }
            return response.json();
        }).then(function (data) {
            if (data.moves === []) {
                that.endPhase2();
            } else {
                that.props.phase2Update(data);
            }
            that.setState({phase2RunButtonDisabled: false});
        });
    }

    endPhase2() {
        this.setState({phase2ButtonText: "Start Phase 1"});
        this.setState({phase2ControlsDisabled: false});
        this.setState({phase2RunButtonDisabled: false});
        this.setState({restartButtonDisabled: false});
        this.props.togglePhase1Lock(true);
    }

    handlePhase2() {
        if (this.state.phase2ButtonText === "Update Phase 2") {
            this.pollPhase2Incremental()
        } else {
            this.runPhase2();
        }
    }


    handleIncrementalClick(evt) {
        if (evt.target.value === "incremental") {
            this.setState({incremental: true});
            this.setState({realtime: false});
        } else if (evt.target.value === "nonIncrementalRealtime") {
            this.setState({incremental: false});
            this.setState({realtime: true});
        } else if (evt.target.value === "nonIncrementalSingleUpdate") {
            this.setState({incremental: false});
            this.setState({realtime: false});
        }
    }

    handleEdgeCompactnessWeight(value) {
        this.setState({edgeCompactnessWeightValue: value})
    }

    handleConvexHullCompactnessWeight(value) {
        this.setState({convexHullCompactnessWeightValue: value})
    }

    handleEfficiencyGapWeight(value) {
        this.setState({efficiencyGapWeightValue: value})
    }

    handleReockCompactnessWeight(value) {
        this.setState({reockCompactnessWeightValue: value})
    }

    handlePopulationEqualityWeight(value) {
        this.setState({populationEqualityWeightValue: value})
    }

    handlePartisanFairnessWeight(value) {
        this.setState({partisanFairnessWeightValue: value})
    }

    handleCompetitivenessWeight(value) {
        this.setState({competitivenessWeightValue: value})
    }

    handleGerrymanderRepublicanWeight(value) {
        this.setState({gerrymanderRepublicanWeightValue: value})
    }

    handleGerrymanderDemocratWeight(value) {
        this.setState({gerrymanderDemocratWeightValue: value})
    }

    handlePopulationHomogeneityWeight(value) {
        this.setState({populationHomogeneityWeightValue: value})
    }

    restart() {
        this.props.togglePhase2Tab(true);
        this.props.togglephase0Lock(false);
    }


    render() {
        if (!this.state.resultsInView && this.props.phase2Tabs) {
            return (
                <Phase2Styles>
                    <Button variant="contained" color="primary" onClick={this.handlePhase2}
                            style={{width: '25vw', marginBottom: '2vw'}}>{this.state.phase2ButtonText}</Button>
                    <div className="row">
                        <Button variant="contained" color="primary" disabled={this.state.resultsUnavailable}
                                style={{height: '6vh', marginRight: '1vw'}} onClick={this.resultsViewOn}>
                            View Results
                        </Button>
                        <Button variant="contained" color="primary" disabled={this.state.restartButtonDisabled}
                                style={{height: '6vh'}} onClick={this.restart}>
                            Restart Phase 0
                        </Button>
                    </div>
                    <ControlGroup>
                        <label className="runLabel">Run Controls:</label>
                        <RunControls name="Incremental" exportState={this.handleIncrementalClick}
                                     disabled={this.state.phase2ControlsDisabled}/>
                    </ControlGroup> <ControlGroup>
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
        } else {
            return (
                <Phase2Styles>
                    <Button variant="contained" color="primary" style={{width: '25vw', marginBottom: '2vw'}}
                            onClick={this.resultsViewOff} disabled={this.props.phase2Tab}>Back to Controls</Button>
                    <h4>{this.state.objFuncType} Gerrymandering Calculations</h4>
                    <h5>Convex Hull Compactness: {this.props.selectedStateGerrymandering.convexHullCompactness}</h5>
                    <h5>Edge Compactness: {this.props.selectedStateGerrymandering.edgeCompactness}</h5>
                    <h5>Reock Compactness: {this.props.selectedStateGerrymandering.reockCompactness}</h5>
                    <h5>Efficiency Gap: {this.props.selectedStateGerrymandering.efficiencyGap}</h5>
                    <h5>Population Equality: {this.props.selectedStateGerrymandering.populationEquality}</h5>
                    <h5>Partisan Fairness: {this.props.selectedStateGerrymandering.partisanFairness}</h5>
                    <h5>Competitiveness: {this.props.selectedStateGerrymandering.competitiveness}</h5>
                    <h5>Gerrymander Republican: {this.props.selectedStateGerrymandering.gerrymanderRepublican}</h5>
                    <h5>Population Homogeneity: {this.props.selectedStateGerrymandering.populationHomogeneity}</h5>
                    <h5>Gerrymander Democrat: {this.props.selectedStateGerrymandering.gerrymanderDemocrat}</h5>
                </Phase2Styles>
            );
        }
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

const OFMarks = [
    {
        value: 0,
        label: '0',
    },
    {
        value: 1,
        label: '1',
    },
];