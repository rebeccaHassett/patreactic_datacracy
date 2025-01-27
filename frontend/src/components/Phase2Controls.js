import React, {Component} from 'react';
import styled from "styled-components";
import SliderControlSingleValue from "./controls/SliderControlSingleValue";
import Button from "@material-ui/core/Button";
import TableDisplay from "./controls/TableDisplay";
import RestartAlertDialog from "./controls/RestartAlertDialog"
import MajorityMinoritySummaryDialog from "./MajorityMinoritySummaryDialog";
import GerrymanderingScoresSummaryDialog from "./GerrymanderingScoresSummaryDialog";

export default class Phase2Controls extends Component {
    constructor() {
        super();
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
        this.handlePhase2 = this.handlePhase2.bind(this);
        this.restart = this.restart.bind(this);
        this.resultsViewOn = this.resultsViewOn.bind(this);
        this.resultsViewOff = this.resultsViewOff.bind(this);
        this.handleDistrictView = this.handleDistrictView.bind(this);
        this.createMajMinData = this.createMajMinData.bind(this);
        this.buildMajMinRows = this.buildMajMinRows.bind(this);
        this.createGerrymanderingData = this.createGerrymanderingData.bind(this);
        this.buildGerrymanderingRows = this.buildGerrymanderingRows.bind(this);
        this.wordCase = this.wordCase.bind(this);
    }

    state = {
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
        phase2ControlsDisabled: false,
        phase2ButtonText: "Start Phase 2",
        districtView: "View Original Districts",
        currentDistrictView: "Original Districts",
        generatedMajMinDistrictDtos: [],
        majorityMinorityRows: [['-', '-', '-', '-']],
        numOriginalCD: 0
    };

    async runPhase2() {
        this.setState({phase2ControlsDisabled: true});
        this.props.togglePhase1ControlsTabDisabled(true);
        this.props.togglePhase0ControlsTabDisabled(true);
        this.props.handleDistrictToggleDisabled(true);
        this.setState({phase2ButtonText: "Stop Phase 2"});

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
            that.pollPhase2NonIncrementalRealtime();
        });
    }

    phase2Update(data) {
        this.setState({generatedMajMinDistrictDtos: data.majMinDistrictDtos});
        this.props.phase2Update(data);
    }

    async pollPhase2NonIncrementalRealtime() {
        let that = this;
        fetch("http://127.0.0.1:8080/phase2/poll", {
            credentials: "include",
        }).then(function (response) {
            if (response.status >= 400) {
                throw new Error("Failed to load phase 2 update from server");
            }
            return response.json();
        }).then(function (data) {
            if (!data.phase2Complete) {
                that.phase2Update(data);
                that.pollPhase2NonIncrementalRealtime();
            }
        });
    }

    async endPhase2() {
        let that = this;
        await fetch("http://127.0.0.1:8080/phase2/stop", {
            credentials: "include",
        }).then(function (response) {
            if (response.status >= 400) {
                throw new Error("Failed to load phase2 data from server");
            }
        });

        this.setState({phase2ButtonText: "Start Phase 2"});
        this.setState({phase2ControlsDisabled: false});
        this.props.togglePhase1ControlsTabDisabled(false);
        this.props.handleDistrictToggleDisabled(false);
    }

    handlePhase2() {
        if (this.state.phase2ButtonText === "Stop Phase 2") {
            this.endPhase2();
        } else if (this.state.phase2ButtonText === "Start Phase 2") {
            this.runPhase2();
        }
    }

    handleDistrictView() {
        /* Selected Original Districts */
        if (this.state.districtView === "View Original Districts") {
            this.setState({districtView: "View Generated Districts"});
            this.setState({currentDistrictView: "Original Districts"});
            this.props.loadOriginalDistricts();
            this.setState({majorityMinorityRows: this.buildMajMinRows(this.props.originalMajMinDistrictDtos)});
        }
        /* Selected Generated Districts */
        else {
            this.setState({districtView: "View Original Districts"});
            this.setState({currentDistrictView: "Generated Districts"});
            this.props.removeOriginalDistricts();
            this.setState({majorityMinorityRows: this.buildMajMinRows(this.state.generatedMajMinDistrictDtos)});
        }
    };

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
        this.props.togglePhase2ControlsTabDisabled(true);
        this.props.togglePhase0ControlsTabDisabled(false);
        this.props.handleDistrictToggleDisabled(true);
        this.props.restartPhase0Tab();
        this.props.loadOriginalDistricts();
        this.props.demographicMapUpdate(false);
        this.setState({restartButtonDisabled: true});
    }

    resultsViewOn() {
        this.setState({resultsInView: true});
    }

    resultsViewOff() {
        this.setState({resultsInView: false});
    }

    createMajMinData(districtId, minorityPopulation, totalPopulation) {
        let percentage = ((minorityPopulation / totalPopulation) * 100);
        return {districtId, minorityPopulation, totalPopulation, percentage};
    }

    buildMajMinRows(majMinDistrictDtos) {
        let tempRows = [];

        majMinDistrictDtos.forEach((majMinDistrict) => {
            let districtId = majMinDistrict.districtId;
            let minorityPopulation = majMinDistrict.minorityPopulation;
            let totalPopulation = majMinDistrict.totalPopulation;
            tempRows.push(this.createMajMinData(districtId, minorityPopulation, totalPopulation));
        });

        return tempRows;
    }

    createGerrymanderingData(measure, value) {
        return {measure, value};
    }

    buildGerrymanderingRows(selectedStateGerrymandering) {
        let tempRows = [];

        let that = this;
        Object.keys(selectedStateGerrymandering).forEach(function (key) {
            let measure = key;
            let value = selectedStateGerrymandering[key];
            tempRows.push(that.createGerrymanderingData(that.wordCase(measure.replace(/_/g, ' ')), value.toFixed(3)));
        });

        return tempRows;
    }

    wordCase(str) {
        var splitStr = str.toLowerCase().split(' ');
        for (var i = 0; i < splitStr.length; i++) {

            splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
        }
        return splitStr.join(' ');
    }

render()
{
    if(this.props.originalDistrictDisplay && this.state.currentDistrictView === "Generated Districts") {
        this.setState({districtView : "View Generated Districts"});
        this.setState({currentDistrictView : "Original Districts"});
    }
    if(!this.props.originalDistrictDisplay && this.state.currentDistrictView === "Original Districts") {
        this.setState({districtView: "View Original Districts"});
        this.setState({currentDistrictView: "Generated Districts"});
    }
    if(this.state.numOriginalCD === 0) {
        if(this.props.chosenState === "RhodeIsland") {
            this.setState({numOriginalCD : 2});
        }
        else if(this.props.chosenState === "Michigan") {
            this.setState({numOriginalCD : 14});
        }
        else if(this.props.chosenState === "NorthCarolina") {
            this.setState({numOriginalCD: 13});
        }
    }

    if (!this.state.resultsInView && !this.props.phase2ControlsTabDisabled) {
        return (
            <Phase2Styles>
                <Button variant="contained" color="primary" onClick={this.handlePhase2}
                        style={{width: '25vw', marginBottom: '2vw'}}>{this.state.phase2ButtonText}</Button>
                <Button variant="contained" color="primary" disabled={this.state.resultsUnavailable}
                        style={{width: '25vw'}} onClick={this.resultsViewOn}>
                    View Results
                </Button>
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
    } else {
        let gerrymanderingRows = [['-', '-']];
        console.log(this.props.selectedStateGerrymandering);
        if (this.props.selectedStateGerrymandering !== null && this.props.selectedStateGerrymandering !== undefined) {
            gerrymanderingRows = this.buildGerrymanderingRows(this.props.selectedStateGerrymandering)
        }

        return (
            <Phase2Styles>
                <h3 style={{fontWeight: 'bold', marginBottom: '2vh'}}>{this.state.currentDistrictView} Results</h3>
                <div className="row">
                <Button variant="contained" color="primary"
                        style={{width: '15vw', height: '7vh', marginRight: '1vw'}}
                        onClick={this.resultsViewOff} disabled={this.props.phase2ControlsTabDisabled}>Back to
                    Controls</Button>
                <Button variant="contained" color="primary"
                        style={{width: '15vw', height: '7vh', marginLeft: '1vw'}} onClick={this.handleDistrictView}
                        disabled={this.props.districtToggleDisabled}>
                    {this.state.districtView}
                </Button>
                </div>
                <h4 style={{marginTop: '2vw'}}>{this.state.objFuncType} Gerrymandering Calculations</h4>
                <GerrymanderingScoresSummaryDialog/>
                <TableDisplay columns={columns} rows={gerrymanderingRows}/>
                <h4 style={{marginTop: '4vh'}}>{this.state.currentDistrictView.split(" ")[0]} Majority-Minority Districts</h4>
                <MajorityMinoritySummaryDialog
                    originalMajMin={this.props.originalMajMinDistrictDtos} generatedMajMin={this.state.generatedMajMinDistrictDtos}
                    originalCDNum={this.state.numOriginalCD} generatedCDNum={this.props.numGeneratedCD}/>
                <TableDisplay columns={this.props.majMinColumns} rows={this.state.majorityMinorityRows}/>
                <RestartAlertDialog restart={this.restart}
                                    districtToggleDisabled={this.props.districtToggleDisabled}
                                    disableBackdropClick={true}/>
            </Phase2Styles>
        );
    }
}
;
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

const columns = [
    {id: 'measure', label: 'Measure',},
    {id: 'value', label: 'Value',},
];