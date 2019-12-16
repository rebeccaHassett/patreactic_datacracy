import React, {Component} from 'react';
import SliderControlUpperLowerValues from "./controls/SliderControlUpperLowerValues";
import SliderControlSingleValue from "./controls/SliderControlSingleValue";
import CheckboxControl from "./controls/CheckboxControl";
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import TextField from "@material-ui/core/TextField";
import AlertDialogSlide from "./controls/AlertControl";
import TableDisplay from "./controls/TableDisplay";
import RunControls from "./controls/RunControls";
import Phase1Dialog from "./Phase1Dialog";


export default class Phase1Controls extends Component {
    constructor() {
        super();
        this.handleNumberCongressionalDistricts = this.handleNumberCongressionalDistricts.bind(this);
        this.handleNumberMajorityMinorityDistricts = this.handleNumberMajorityMinorityDistricts.bind(this);
        this.handleMinorityPopulationThreshold = this.handleMinorityPopulationThreshold.bind(this);
        this.handleIncrementalClick = this.handleIncrementalClick.bind(this);
        this.resultsViewOff = this.resultsViewOff.bind(this);
        this.resultsViewOn = this.resultsViewOn.bind(this);
        this.runPhase1 = this.runPhase1.bind(this);
        this.handlePhase1 = this.handlePhase1.bind(this);
        this.handleAlertDialogState = this.handleAlertDialogState.bind(this);
        this.handleSelectedDemographics = this.handleSelectedDemographics.bind(this);
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
        this.handleCountyJoinabilityWeight = this.handleCountyJoinabilityWeight.bind(this);
        this.handleMajorityMinorityWeight = this.handleMajorityMinorityWeight.bind(this);
    }

    /* For now, hardcoding election type but will set to phase 0 and data election type */
    state = {
        numCongressionalDistricts: 6,
        numMajorityMinorityDistricts: 3,
        minorityPopulationThresholdValues: [80, 90],
        incremental: true,
        realtime: false,
        selectedMinorities: [],
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
        countyJoinabilityWeightValue: 0.1,
        majorityMinorityWeightValue: 0.1,
        phase1RunButtonDisabled: false,
        alertDialogState: false,
        alertDialogText: "Must Select At Least One Minority Group!",
        resultsInView: false,
        resultsUnavailable: true,
        majorityMinorityRows: [['-', '-', '-', '-']],
        phase1ButtonText: "Start Phase 1",
        phase1ControlsDisabled: false,
        restartButtonDisabled: true
    };

    async runPhase1() {
        if (!this.state.numCongressionalDistricts) {
            this.setState({alertDialogState: true});
            this.setState({alertDialogText: "Must Select Desired Number of Congressional Districts!"});
            return;
        }
        if (!this.state.numMajorityMinorityDistricts) {
            this.setState({alertDialogState: true});
            this.setState({alertDialogText: "Must Select Desired Number of Majority-Minority Districts!"});
            return;
        }
        if (this.state.selectedMinorities.length === 0) {
            this.setState({alertDialogState: true});
            this.setState({alertDialogText: "Must Select At Least One Minority Group!"});
            return;
        }

        this.setState({phase1RunButtonDisabled: true});
        this.setState({resultsUnavailable: true});
        this.setState({phase1ControlsDisabled: true});
        this.props.togglePhase2ControlsTabDisabled(true);
        this.props.togglePhase0ControlsTabDisabled(true);
        this.props.handleDistrictToggleDisabled(true);
        this.setState({restartButtonDisabled: true});

        let normalizedCompetitiveness = (1/11);
        let normalizedPopulationHomogeneity = (1/11);
        let normalizedGerrymanderDemocrat = (1/11);
        let normalizedGerrymanderRepublican = (1/11);
        let normalizedPopulationEquality = (1/11);
        let normalizedEdgeCompactness = (1/11);
        let normalizedEfficiencyGap = (1/11);
        let normalizedReockCompactness = (1/11);
        let normalizedConvexHullCompactness = (1/11);
        let normalizedPartisanFairness = (1/11);
        let normalizedCountyJoinability = (1/11);

        /*Normalize Weights:
            Divide each number by the sum of all numbers [if sum is 0, set each number to 0.1 since each weighting]*/
        let sum = this.state.competitivenessWeightValue + this.state.populationHomogeneityWeightValue + this.state.gerrymanderDemocratWeightValue
            + this.state.gerrymanderRepublicanWeightValue + this.state.populationEqualityWeightValue
            + this.state.edgeCompactnessWeightValue + this.state.efficiencyGapWeightValue
            + this.state.reockCompactnessWeightValue + this.state.convexHullCompactnessWeightValue
            + this.state.partisanFairnessWeightValue + this.state.countyJoinabilityWeightValue;

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
            normalizedCountyJoinability = this.state.countyJoinabilityWeightValue / sum;
        }

        console.log(this.state.numCongressionalDistricts);

        var phase1Dto = {
            config: {
                thresholds: {
                    "MINORITY_PERCENTAGE":
                        {
                            "lower": this.state.minorityPopulationThresholdValues[0] / 100.0,
                            "upper": this.state.minorityPopulationThresholdValues[1] / 100.0
                        },
                },
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
                    "GERRYMANDER_DEMOCRAT": normalizedGerrymanderDemocrat,
                    "COUNTY_JOINABILITY": normalizedCountyJoinability
                },
                incremental: this.state.incremental,
                realtime: this.state.realtime,
                numDistricts: Number(this.state.numCongressionalDistricts),
                numMajMinDistricts: Number(this.state.numMajorityMinorityDistricts),
                selectedMinorities: this.state.selectedMinorities,
                year: this.props.election.split(" ")[1],
                type: this.props.election.split(" ")[0],
                majMinWeight: this.state.majorityMinorityWeightValue,
            },
            stateName: this.props.chosenState,
        };

        let that = this;
        await fetch("http://127.0.0.1:8080/phase1/start", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Origin': 'http://localhost:3000'
            },
            body: JSON.stringify(phase1Dto),
            credentials: 'include',
        }).then(function (response) {
            if (response.status >= 400) {
                throw new Error("Failed to load phase1 data from server");
            }
            return response.json();
        }).then(function (data) {
            that.props.initializePhase1Map(data);

            that.majorityMinorityDistrictsDisplay(data);

            that.setState({resultsUnavailable: false});
            if (that.state.incremental) {
                that.setState({phase1ButtonText: "Update Phase 1"});
            }
            if (that.state.incremental) {
                that.setState({phase1RunButtonDisabled: false});
            } else {
                if (that.state.realtime) {
                    that.pollPhase1NonIncrementalRealtime(); //update each iteration
                } else {
                    that.pollPhase1NonIncrementalUpdateEnd(); //update only at the end
                }
            }
        });
    }

    createData(districtId, minorityPopulation, totalPopulation) {
        let percentage = ((minorityPopulation / totalPopulation) * 100);
        return {districtId, minorityPopulation, totalPopulation, percentage};
    }

    majorityMinorityDistrictsDisplay(data) {
        let tempRows = [];

        console.log("FRONTEND");
        data.majMinDistrictDtos.forEach((majMinDistrict) => {
            let districtId = majMinDistrict.districtId;
            let minorityPopulation = majMinDistrict.minorityPopulation;
            console.log(minorityPopulation);
            let totalPopulation = majMinDistrict.totalPopulation;
            tempRows.push(this.createData(districtId, minorityPopulation, totalPopulation));
        });

        this.setState({majorityMinorityRows: tempRows});
    }

    async pollPhase1NonIncrementalRealtime() {
        let that = this;
        fetch("http://127.0.0.1:8080/phase1/poll", {
            credentials: "include",
        }).then(function (response) {
            if (response.status >= 400) {
                throw new Error("Failed to load phase 1 update from server");
            }
            return response.json();
        }).then(function (data) {
            if (data.districtUpdates.length === 0) {
                that.endPhase1();
            } else {
                that.props.phase1Update(data);
                that.pollPhase1NonIncrementalRealtime();
            }
        });
    }

    async pollPhase1NonIncrementalUpdateEnd() {
        let that = this;
        fetch("http://127.0.0.1:8080/phase1/complete", {
            credentials: "include",
        }).then(function (response) {
            if (response.status >= 400) {
                throw new Error("Failed to load phase 1 update from server");
            }
            return response.json();
        }).then(function (data) {
            that.props.initializePhase1Map(data);
            that.endPhase1();
        });
    }

    async pollPhase1Incremental() {
        this.setState({phase1RunButtonDisabled: true});
        let that = this;
        fetch("http://127.0.0.1:8080/phase1/poll", {
            headers: {'Access-Control-Allow-Credentials': true, 'Access-Control-Allow-Origin': 'http://localhost:3000'},
            credentials: 'include'
        }).then(function (response) {
            if (response.status >= 400) {
                throw new Error("Failed to load phase 1 update from server");
            }
            return response.json();
        }).then(function (data) {
            if (data.districtUpdates.length === 0) {
                that.endPhase1();
            } else {
                that.props.phase1Update(data);
            }
            that.setState({phase1RunButtonDisabled: false});
        });
    }

    endPhase1() {
        this.setState({phase1ButtonText: "Start Phase 1"});
        this.setState({phase1ControlsDisabled: false});
        this.props.togglePhase2ControlsTabDisabled(false);
        this.props.handleDistrictToggleDisabled(false);
        this.setState({phase1RunButtonDisabled: false});
        this.setState({restartButtonDisabled: false});
    }

    handlePhase1() {
        if (this.state.phase1ButtonText === "Update Phase 1") {
            this.pollPhase1Incremental()
        } else {
            this.runPhase1();
        }
    }

    handleAlertDialogState(value) {
        this.setState({alertDialogState: value});
    }

    handleNumberCongressionalDistricts(event) {
        if ((Number(event.target.value) >= 1 && Number(event.target.value) <= 60) || !event.target.value) {
            this.setState({numCongressionalDistricts: event.target.value})
        }
        if (Number(event.target.value) < Number(this.state.numMajorityMinorityDistricts)) {
            this.setState({numMajorityMinorityDistricts: event.target.value});
        }
    }

    handleNumberMajorityMinorityDistricts(event) {
        if ((Number(event.target.value) >= 0 && Number(event.target.value) <= Number(this.state.numCongressionalDistricts)) || !event.target.value) {
            this.setState({numMajorityMinorityDistricts: event.target.value})
        }
    }

    handleMinorityPopulationThreshold(value) {
        this.setState({minorityPopulationThresholdValues: value})
    }

    handleIncrementalClick(evt) {
        console.log(evt.target.value);
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

    handleSelectedDemographics(updatedDemographics) {
        if (Object.keys(updatedDemographics).length === 5) {
            this.setState({selectedMinorities: Object.entries(updatedDemographics).filter(([d, chosen]) => chosen).map(([d, chosen]) => d)})
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

    handleCountyJoinabilityWeight(value) {
        this.setState({countyJoinabilityWeightValue: value})
    }

    handleMajorityMinorityWeight(value) {
        this.setState({majorityMinorityWeightValue: value})
    }

    resultsViewOn() {
        this.setState({resultsInView: true});
    }

    resultsViewOff() {
        this.setState({resultsInView: false});
    }

    /* Restart will unlock phase 0, lock phase 2, lock district toggle, and switch to phase 0 tab */
    restart() {
        this.props.togglePhase0ControlsTabDisabled(false);
        this.props.togglePhase2ControlsTabDisabled(true);
        this.props.handleDistrictToggleDisabled(true);
        this.props.restartPhase0Tab();
    }

    render() {
        if (!this.state.resultsInView && !this.props.phase1ControlsTabDisabled) {
            return (
                <Phase1Styles>
                    <AlertDialogSlide exportState={this.handleAlertDialogState} open={this.state.alertDialogState}
                                      alert={this.state.alertDialogText}/>
                    <Button variant="contained" color="primary" disabled={this.state.phase1RunButtonDisabled}
                            onClick={this.handlePhase1} style={{width: '25vw', marginBottom: '2vw'}}>
                        {this.state.phase1ButtonText}
                    </Button>
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
                                     disabled={this.state.phase1ControlsDisabled}/>
                    </ControlGroup>
                    <TextField
                        id="outlined-number"
                        label="Congressional Districts"
                        type="number"
                        style={{margin: 15, width: '25vw'}}
                        onChange={this.handleNumberCongressionalDistricts}
                        variant="filled"
                        value={this.state.numCongressionalDistricts}
                        disabled={this.state.phase1ControlsDisabled}
                    />
                    <TextField
                        id="outlined-number"
                        label="Majority-Minority Districts"
                        type="number"
                        style={{margin: 15, width: '25vw'}}
                        onChange={this.handleNumberMajorityMinorityDistricts}
                        variant="filled"
                        value={this.state.numMajorityMinorityDistricts}
                        disabled={this.state.phase1ControlsDisabled}
                    />
                    <ControlGroup id="minorityPopulationThreshold">
                        <label className="ethnicLabel">Ethnic/Racial Groups:</label>
                        <CheckboxControl exportState={this.handleSelectedDemographics}
                                         disabled={this.state.phase1ControlsDisabled}
                                         helperText="Must select at least one demographic"/>
                    </ControlGroup>
                    <Phase1Dialog/>
                    <ControlGroup id="minorityPopulationThreshold">
                        <label className="label">Minority Population Thresholds:</label>
                        <SliderControlUpperLowerValues disabled={this.state.phase1ControlsDisabled}
                                                       exportState={this.handleMinorityPopulationThreshold}/>
                    </ControlGroup>
                    <ControlGroup>
                        <label className="label">Majority Minority Weighting:</label>
                        <SliderControlSingleValue min={0} max={1} step={0.01} marks={OFMarks}
                                                  disabled={this.state.phase1ControlsDisabled}
                                                  exportState={this.handleMajorityMinorityWeight}/>
                    </ControlGroup>
                    <ControlGroup>
                        <label className="label">County Joinability Weighting:</label>
                        <SliderControlSingleValue min={0} max={1} step={0.01} marks={OFMarks}
                                                  disabled={this.state.phase1ControlsDisabled}
                                                  exportState={this.handleCountyJoinabilityWeight}/>
                    </ControlGroup>
                    <ControlGroup>
                        <label className="label">Convex Hull Compactness Weighting:</label>
                        <SliderControlSingleValue min={0} max={1} step={0.01} marks={OFMarks}
                                                  disabled={this.state.phase1ControlsDisabled}
                                                  exportState={this.handleConvexHullCompactnessWeight}/>
                    </ControlGroup>
                    <ControlGroup>
                        <label className="label">Reock Compactness Weighting:</label>
                        <SliderControlSingleValue min={0} max={1} step={0.01} marks={OFMarks}
                                                  disabled={this.state.phase1ControlsDisabled}
                                                  exportState={this.handleReockCompactnessWeight}/>
                    </ControlGroup>
                    <ControlGroup>
                        <label className="label">Edge Compactness Weighting:</label>
                        <SliderControlSingleValue min={0} max={1} step={0.01} marks={OFMarks}
                                                  disabled={this.state.phase1ControlsDisabled}
                                                  exportState={this.handleEdgeCompactnessWeight}/>
                    </ControlGroup>
                    <ControlGroup>
                        <label className="label">Efficiency Gap Weighting:</label>
                        <SliderControlSingleValue min={0} max={1} step={0.01} marks={OFMarks}
                                                  disabled={this.state.phase1ControlsDisabled}
                                                  exportState={this.handleEfficiencyGapWeight}/>
                    </ControlGroup>
                    <ControlGroup>
                        <label className="label">Population Homogeneity Weighting:</label>
                        <SliderControlSingleValue min={0} max={1} step={0.01} marks={OFMarks}
                                                  disabled={this.state.phase1ControlsDisabled}
                                                  exportState={this.handlePopulationHomogeneityWeight}/>
                    </ControlGroup>
                    <ControlGroup>
                        <label className="label">Population Equality Weighting:</label>
                        <SliderControlSingleValue min={0} max={1} step={0.01} marks={OFMarks}
                                                  disabled={this.state.phase1ControlsDisabled}
                                                  exportState={this.handlePopulationEqualityWeight}/>
                    </ControlGroup>
                    <ControlGroup>
                        <label className="label">Partisan Fairness Weighting:</label>
                        <SliderControlSingleValue min={0} max={1} step={0.01} marks={OFMarks}
                                                  disabled={this.state.phase1ControlsDisabled}
                                                  exportState={this.handlePartisanFairnessWeight}/>
                    </ControlGroup>
                    <ControlGroup>
                        <label className="label">Competitiveness Weighting:</label>
                        <SliderControlSingleValue min={0} max={1} step={0.01} marks={OFMarks}
                                                  disabled={this.state.phase1ControlsDisabled}
                                                  exportState={this.handleCompetitivenessWeight}/>
                    </ControlGroup>
                    <ControlGroup>
                        <label className="label">Gerrymander Republican Weighting:</label>
                        <SliderControlSingleValue min={0} max={1} step={0.01} marks={OFMarks}
                                                  disabled={this.state.phase1ControlsDisabled}
                                                  exportState={this.handleGerrymanderRepublicanWeight}/>
                    </ControlGroup>
                    <ControlGroup>
                        <label className="label">Gerrymander Democrat Weighting:</label>
                        <SliderControlSingleValue min={0} max={1} step={0.01} marks={OFMarks}
                                                  disabled={this.state.phase1ControlsDisabled}
                                                  exportState={this.handleGerrymanderDemocratWeight}/>
                    </ControlGroup>
                </Phase1Styles>
            );
        } else {
            return (
                <Phase1Styles>
                    <Button variant="contained" color="primary" style={{width: '25vw', marginBottom: '2vw'}}
                            onClick={this.resultsViewOff} disabled={this.props.phase1ControlsTabDisabled}>Back to Controls</Button>
                    <h5>Majority-Minority Districts</h5>
                    <TableDisplay columns={columns} rows={this.state.majorityMinorityRows}/>
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
    .runLabel {
        margin-top: 2vw;
        font-weight: bold;
    }
`;

const ControlGroup = styled.div`
    width: 80%;
`;


const OFMarks = [
    {
        value: 0,
        label: '0',
    },
    {
        value: 0.5,
        label: '0.5',
    },
    {
        value: 1,
        label: '1',
    },
];

const columns = [
    {id: 'districtId', label: 'Name', format: value => value.toLocaleString(),},
    {id: 'minorityPopulation', label: 'Minority Population',format: value => value.toLocaleString(),},
    {id: 'totalPopulation', label: 'Total Population', format: value => value.toLocaleString(),},
    {id: 'percentage', label: '%', format: value => value.toLocaleString(),},
];

