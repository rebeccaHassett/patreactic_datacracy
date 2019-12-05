import React, { Component } from 'react';
import SliderControlUpperLowerValues from "./controls/SliderControlUpperLowerValues";
import SliderControlSingleValue from "./controls/SliderControlSingleValue";
import SwitchControl from "./controls/SwitchControl";
import CheckboxControl from "./controls/CheckboxControl";
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import AlertDialogSlide from "./controls/AlertControl";

export default class Phase1Controls extends Component {
    constructor() {
        super();
        this.handleNumberCongressionalDistricts = this.handleNumberCongressionalDistricts.bind(this);
        this.handleNumberMajorityMinorityDistricts = this.handleNumberMajorityMinorityDistricts.bind(this);
        this.handleMinorityPopulationThreshold = this.handleMinorityPopulationThreshold.bind(this);
        this.handleIncrementalClick = this.handleIncrementalClick.bind(this);
        this.handleRealTimeClick = this.handleRealTimeClick.bind(this);
        this.runPhase1 = this.runPhase1.bind(this);
        this.handleSelectedDemographics = this.handleSelectedDemographics.bind(this);
        this.initializeClusters = this.initializeClusters.bind(this);
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
        this.handleAlertDialogState = this.handleAlertDialogState.bind(this);
        this.handleResultsView = this.handleResultsView.bind(this);
    }

    state = {
        numCongressionalDistricts: 0,
        numMajorityMinorityDistricts: 0,
        minorityPopulationThresholdValues: [],
        incremental: false,
        realtime: false,
        selectedMinorities: [],
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
        convexHullCompactnessWeightValue: 0.1,
        edgeCompactnessWeightValue: 0.1,
        reockCompactnessWeightValue: 0.1,
        efficiencyGapWeightValue: 0.1,
        populationEqualityWeightValue: 0.1,
        partisanFairnessWeightValue: 0.1,
        competitivenessWeightValue: 0.1,
        gerrymanderRepublicanWeightValue: 0.1,
        populationHomogeneityWeightValue: 0.1,
        gerrymanderDemocratWeightValue: 0.1,
        phase1Disabled: false,
        alertDialogState: false,
        resultsInView: false,
        resultsUnavailable: true
    }

    initializeClusters() {
        if (this.props.precinctLayer !== null) {
            this.props.precinctLayer.eachLayer(function (layer) {
                if (layer.feature.properties.OBJECTID % 2 === 0) {
                    layer.setStyle({ fillColor: 'blue' })
                } else {
                    layer.setStyle({ fillColor: 'red' })
                }
            })
        }
    }

    async runPhase1() {
        if (this.state.selectedMinorities.length === 0) {
            this.setState({alertDialogState: true});
            return;
        }

        this.setState({runPhase1Disabled: true});
        this.setState({resultsUnavailable: true});

        /*this.props.removeOGDisrtricts();

        this.initializeClusters();*/

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
                + this.state.partisanFairnessWeightValue

            if(sum !== 0) {
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

        var phase1Dto = {
            config: {
                thresholds: [{
                    name: "MINORITY_PERCENTAGE",
                    lower: this.state.minorityPopulationThresholdValues[0] / 100.0,
                    upper: this.state.minorityPopulationThresholdValues[1] / 100.0
                },
                    {
                        name: "CONVEX_HULL_COMPACTNESS",
                        lower: this.state.convexHullCompactnessValues[0] / 100.0,
                        upper: this.state.convexHullCompactnessValues[1] / 100.0
                    },
                    {
                        name: "REOCK_COMPACTNESS",
                        lower: this.state.reockCompactnessValues[0] / 100.0,
                        upper: this.state.reockCompactnessValues[1] / 100.0
                    },
                    {
                        name: "EDGE_COMPACTNESS",
                        lower: this.state.edgeCompactnessValues[0] / 100.0,
                        upper: this.state.edgeCompactnessValues[1] / 100.0
                    },
                    {
                        name: "EFFICIENCY_GAP",
                        lower: this.state.efficiencyGapValues[0] / 100.0,
                        upper: this.state.efficiencyGapValues[1] / 100.0
                    },
                    {
                        name: "POPULATION_HOMOGENEITY",
                        lower: this.state.populationHomogeneityValues[0] / 100.0,
                        upper: this.state.populationHomogeneityValues[1] / 100.0
                    },
                    {
                        name: "POPULATION_EQUALITY",
                        lower: this.state.populationEqualityValues[0] / 100.0,
                        upper: this.state.populationEqualityValues[1] / 100.0
                    },
                    {
                        name: "PARTISAN_FAIRNESS",
                        lower: this.state.partisanFairnessValues[0] / 100.0,
                        upper: this.state.partisanFairnessValues[1] / 100.0
                    },
                    {
                        name: "COMPETITIVENESS",
                        lower: this.state.competitivenessValues[0] / 100.0,
                        upper: this.state.competitivenessValues[1] / 100.0
                    },
                    {
                        name: "GERRYMANDER_REPUBLICAN",
                        lower: this.state.gerrymanderRepublicanValues[0] / 100.0,
                        upper: this.state.gerrymanderRepublicanValues[1] / 100.0
                    },
                    {
                        name: "GERRYMANDER_DEMOCRAT",
                        lower: this.state.gerrymanderDemocratValues[0] / 100.0,
                        upper: this.state.gerrymanderDemocratValues[1] / 100.0
                    },],
                weights: {"PARTISAN_FAIRNESS": normalizedPartisanFairness,
                    "REOCK_COMPACTNESS": normalizedReockCompactness,
                    "CONVEX_HULL_COMPACTNESS": normalizedConvexHullCompactness,
                    "EDGE_COMPACTNESS": normalizedEdgeCompactness,
                    "EFFICIENCY_GAP": normalizedEfficiencyGap,
                    "POPULATION_EQUALITY": normalizedPopulationEquality,
                    "COMPETITIVENESS": normalizedCompetitiveness,
                    "GERRYMANDER_REPUBLICAN": normalizedGerrymanderRepublican,
                    "POPULATION_HOMOGENEITY": normalizedPopulationHomogeneity,
                    "GERRYMANDER_DEMOCRAT": normalizedGerrymanderDemocrat},
                incremental: this.state.incremental,
                realtime: this.state.realtime,
                numDistricts: this.state.numCongressionalDistricts,
                numMajMinDistricts: this.state.numMajorityMinorityDistricts,
                selectedMinorities: this.state.selectedMinorities,
                year: this.state.electionYear,
                type: this.state.electionType
            },
            stateName: this.props.chosenState,
            incremental: this.state.incremental
        };

        const response = await fetch("http://127.0.0.1:8080/runPhase1", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(phase1Dto),
        })

        //var updatedPrecinctFeatures = []

        //this.props.handlePrecinctFeatures(updatedPrecinctFeatures);
        this.setState({resultsUnavailable: false})
    }

    handleAlertDialogState(value) {
        this.setState({alertDialogState: value});
    }

    handleNumberCongressionalDistricts(value) {
        this.setState({ numCongressionalDistricts: value })
    }

    handleNumberMajorityMinorityDistricts(value) {
        this.setState({ numMajorityMinorityDistricts: value })
    }

    handleMinorityPopulationThreshold(value) {
        this.setState({ minorityPopulationThresholdValues: value })
    }

    handleIncrementalClick(evt) {
        this.setState({ incremental: evt.target.checked })
    }

    handleRealTimeClick(evt) {
        this.setState({ realtime: evt.target.checked })
    }

    handleSelectedDemographics(updatedDemographics) {
        this.setState({ selectedMinorities: Object.entries(updatedDemographics).filter(([d, chosen]) => chosen).map(([d, chosen]) => d) })
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

    handleResultsView(value) {
        this.setState({resultsInView: value});
    }

    render() {
        let marks;
        let min;
        let max;
        if (this.props.chosenState === "RhodeIsland") {
            marks = rhodeIslandMarks;
            min = 1;
            max = 2;
        }
        else if (this.props.chosenState === "Michigan") {
            marks = michiganMarks;
            min = 1;
            max = 14;
        }
        else if (this.props.chosenState === "NorthCarolina") {
            marks = northCarolinaMarks;
            min = 1;
            max = 14;
        }
        if (this.state.resultsUnavailable === true || this.state.resultsInView === false) {
            return (
                <Phase1Styles>
                    <AlertDialogSlide exportState={this.handleAlertDialogState} open={this.state.alertDialogState}
                                      alert="Must Select At Least One Minority Group!"/>
                    <Button variant="contained" color="primary" disabled={this.state.phase1Disabled}
                            onClick={this.runPhase1} style={{width: '25vw', marginBottom: '2vw'}}>
                        Start Phase 1
                    </Button>
                    <SwitchControl name="Incremental" exportIncremental={this.handleIncrementalClick}
                                   exportRealTime={this.handleRealTimeClick}/>
                    <Button variant="contained" color="primary" disabled={false}
                            style={{width: '25vw', marginTop: '2vw'}} onClick={this.handleResultsView}>
                        View Results
                    </Button>
                    <ControlGroup id="numberDistricts">
                        <label className="label">Congressional Districts:</label>
                        <SliderControlSingleValue step={1}
                                                  exportState={this.handleNumberCongressionalDistricts} marks={marks}
                                                  min={min} max={max}/>
                    </ControlGroup>
                    <ControlGroup id="majorityMinorityDistricts">
                        <label className="label">Majority-Minority Districts</label>
                        <SliderControlSingleValue step={1}
                                                  exportState={this.handleNumberMajorityMinorityDistricts} marks={marks}
                                                  min={min} max={max}/>
                    </ControlGroup>
                    <ControlGroup id="minorityPopulationThreshold">
                        <label className="label">Minority Population Thresholds:</label>
                        <SliderControlUpperLowerValues
                            exportState={this.handleMinorityPopulationThreshold}/>
                    </ControlGroup>
                    <ControlGroup id="minorityPopulationThreshold">
                        <label className="ethnicLabel">Ethnic/Racial Groups:</label>
                        <CheckboxControl exportState={this.handleSelectedDemographics}/>
                    </ControlGroup>
                    <ControlGroup>
                        <label className="label">Convex Hull Compactness Thresholds:</label>
                        <SliderControlUpperLowerValues
                            exportState={this.handleConvexHullCompactness}/>
                    </ControlGroup>
                    <ControlGroup>
                        <label className="label">Convex Hull Compactness Weighting:</label>
                        <SliderControlSingleValue min={0} max={1} step={0.01}
                                                  exportState={this.handleConvexHullCompactnessWeight}/>
                    </ControlGroup>
                    <ControlGroup>
                        <label className="label">Reock Compactness Thresholds:</label>
                        <SliderControlUpperLowerValues
                            exportState={this.handleReockCompactness}/>
                    </ControlGroup>
                    <ControlGroup>
                        <label className="label">Reock Compactness Weighting:</label>
                        <SliderControlSingleValue min={0} max={1} step={0.01}
                                                  exportState={this.handleReockCompactnessWeight}/>
                    </ControlGroup>
                    <ControlGroup>
                        <label className="label">Edge Compactness Thresholds:</label>
                        <SliderControlUpperLowerValues
                            exportState={this.handleEdgeCompactness}/>
                    </ControlGroup>
                    <ControlGroup>
                        <label className="label">Edge Compactness Weighting:</label>
                        <SliderControlSingleValue min={0} max={1} step={0.01}
                                                  exportState={this.handleEdgeCompactnessWeight}/>
                    </ControlGroup>
                    <ControlGroup>
                        <label className="label">Efficiency Gap Thresholds:</label>
                        <SliderControlUpperLowerValues
                            exportState={this.handleEfficiencyGap}/>
                    </ControlGroup>
                    <ControlGroup>
                        <label className="label">Efficiency Gap Weighting:</label>
                        <SliderControlSingleValue min={0} max={1} step={0.01}
                                                  exportState={this.handleEfficiencyGapWeight}/>
                    </ControlGroup>
                    <ControlGroup>
                        <label className="label">Population Homogeneity Thresholds:</label>
                        <SliderControlUpperLowerValues
                            exportState={this.handlePopulationHomogeneity}/>
                    </ControlGroup>
                    <ControlGroup>
                        <label className="label">Population Homogeneity Weighting:</label>
                        <SliderControlSingleValue min={0} max={1} step={0.01}
                                                  exportState={this.handlePopulationHomogeneityWeight}/>
                    </ControlGroup>
                    <ControlGroup>
                        <label className="label">Population Equality Thresholds:</label>
                        <SliderControlUpperLowerValues
                            exportState={this.handlePopulationEquality}/>
                    </ControlGroup>
                    <ControlGroup>
                        <label className="label">Population Equality Weighting:</label>
                        <SliderControlSingleValue min={0} max={1} step={0.01}
                                                  exportState={this.handlePopulationEqualityWeight}/>
                    </ControlGroup>
                    <ControlGroup>
                        <label className="label">Partisan Fairness Thresholds:</label>
                        <SliderControlUpperLowerValues
                            exportState={this.handlePartisanFairness}/>
                    </ControlGroup>
                    <ControlGroup>
                        <label className="label">Partisan Fairness Weighting:</label>
                        <SliderControlSingleValue min={0} max={1} step={0.01}
                                                  exportState={this.handlePartisanFairnessWeight}/>
                    </ControlGroup>
                    <ControlGroup>
                        <label className="label">Competitiveness Thresholds:</label>
                        <SliderControlUpperLowerValues
                            exportState={this.handleCompetitiveness}/>
                    </ControlGroup>
                    <ControlGroup>
                        <label className="label">Competitiveness Weighting:</label>
                        <SliderControlSingleValue min={0} max={1} step={0.01}
                                                  exportState={this.handleCompetitivenessWeight}/>
                    </ControlGroup>
                    <ControlGroup>
                        <label className="label">Gerrymander Republican Thresholds:</label>
                        <SliderControlUpperLowerValues
                            exportState={this.handleGerrymanderRepublican}/>
                    </ControlGroup>
                    <ControlGroup>
                        <label className="label">Gerrymander Republican Weighting:</label>
                        <SliderControlSingleValue min={0} max={1} step={0.01}
                                                  exportState={this.handleGerrymanderRepublicanWeight}/>
                    </ControlGroup>
                    <ControlGroup>
                        <label className="label">Gerrymander Democrat Thresholds:</label>
                        <SliderControlUpperLowerValues
                            exportState={this.handleGerrymanderDemocrat}/>
                    </ControlGroup>
                    <ControlGroup>
                        <label className="label">Gerrymander Democrat Weighting:</label>
                        <SliderControlSingleValue min={0} max={1} step={0.01}
                                                  exportState={this.handleGerrymanderDemocratWeight}/>
                    </ControlGroup>
                </Phase1Styles>
            );
        }
        else {
            return(
                <Phase1Styles>
            <Button variant="contained" color="primary" style={{ width: '25vw', marginBottom: '2vw' }}
                    onClick={this.handleResultsView}>Back to Controls</Button>
                </Phase1Styles>
            );
        }
    };
}

const Phase1Styles = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;

    .label {
      margin-bottom: 2.5vw;
      font-weight: bold;
      margin-top: 2vw;
    }
    .ethnicLabel {
      font-weight: bold;
    }
`;

const ControlGroup = styled.div`
    width: 80%;
`;

const rhodeIslandMarks = [
    {
        value: 1,
        label: '1',
    },
    {
        value: 2,
        label: '2',
    },
];

const michiganMarks = [
    {
        value: 1,
        label: '1',
    },
    {
        value: 4,
        label: '4',
    },
    {
        value: 7,
        label: '7',
    },
    {
        value: 10,
        label: '10',
    },
    {
        value: 14,
        label: '14',
    },
];


const northCarolinaMarks = [
    {
        value: 1,
        label: '1',
    },
    {
        value: 4,
        label: '4',
    },
    {
        value: 7,
        label: '7',
    },
    {
        value: 10,
        label: '10',
    },
    {
        value: 13,
        label: '13',
    },
];