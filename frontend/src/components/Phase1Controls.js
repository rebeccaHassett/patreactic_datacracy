import React, { Component } from 'react';
import SliderControlUpperLowerValues from "./controls/SliderControlUpperLowerValues";
import SliderControlSingleValue from "./controls/SliderControlSingleValue";
import SwitchControl from "./controls/SwitchControl";
import CheckboxControl from "./controls/CheckboxControl";
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import AlertDialogSlide from "./controls/AlertControl";
import TableDisplay from "./controls/TableDisplay";
import FormHelperText from "@material-ui/core/FormHelperText";

export default class Phase1Controls extends Component {
    constructor() {
        super();
        this.handleNumberCongressionalDistricts = this.handleNumberCongressionalDistricts.bind(this);
        this.handleNumberMajorityMinorityDistricts = this.handleNumberMajorityMinorityDistricts.bind(this);
        this.handleMinorityPopulationThreshold = this.handleMinorityPopulationThreshold.bind(this);
        this.handleIncrementalClick = this.handleIncrementalClick.bind(this);
        this.handleRealTimeClick = this.handleRealTimeClick.bind(this);
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
    }

    /* For now, hardcoding election type but will set to phase 0 and data election type */
    state = {
        numCongressionalDistricts: 0,
        numMajorityMinorityDistricts: 0,
        minorityPopulationThresholdValues: [],
        incremental: false,
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
        phase1RunButtonDisabled: false,
        alertDialogState: false,
        resultsInView: false,
        resultsUnavailable: false,
        majorityMinorityRows: [['-', '-']],
        phase1ButtonText: "Start Phase 1",
        phase1ControlsDisabled: false,
        electionType: 'Presidential',
        electionYear: '2016'
    };

    async runPhase1() {
        if (this.state.selectedMinorities.length === 0) {
            this.setState({alertDialogState: true});
            return;
        }

        this.setState({phase1RunButtonDisabled: true});
        this.setState({resultsUnavailable: true});
        this.setState({phase1ControlsDisabled : true});
        this.props.togglePhase2Tab(true);

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
                    "GERRYMANDER_DEMOCRAT": normalizedGerrymanderDemocrat
                },
                incremental: this.state.incremental,
                realtime: this.state.realtime,
                numDistricts: this.state.numCongressionalDistricts,
                numMajMinDistricts: this.state.numMajorityMinorityDistricts,
                selectedMinorities: this.state.selectedMinorities,
                year: this.state.electionYear,
                type: this.state.electionType
            },
            stateName: this.props.chosenState,
        };

        let that = this;
        await fetch("http://127.0.0.1:8080/phase1/start", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(phase1Dto),
        }).then(function (response) {
            if (response.status >= 400) {
                throw new Error("Failed to load phase1 data from server");
            }
            return response.json();
        }).then(function (data) {
            that.props.initializePhase1Map(data);

        that.setState({resultsUnavailable: false});
        if(that.state.incremental) {
            that.setState({phase1ButtonText: "Update Phase 1"});
        }
        that.props.handleGeneratedDistricts();
        if(that.state.incremental) {
            that.setState({phase1RunButtonDisabled: false});
        }
        else {
            if(that.state.realtime) {
                that.pollPhase1NonIncremental(1000); //every second
            }
            else {
                that.pollPhase1NonIncremental(40000); //every 40 seconds
            }
        }
        });
    }

    async pollPhase1NonIncremental(timeout) {
        var timesRun = 0;
        var interval = setInterval(function(){
            fetch("http://127.0.0.1:8080/phase1/poll").then(function (response) {
                if (response.status >= 400) {
                    throw new Error("Failed to load phase 1 update from server");
                }
                return response.json();
            }).then(function (data) {
                console.log(data);
                if(data.districtUpdates === []) {
                    this.endPhase1();
                    clearInterval(interval);
                }
                else {
                    this.props.phase1Update(data);
                }
            });
        }, timeout);
    };

    async pollPhase1Incremental() {
        this.setState({phase1RunButtonDisabled: true});
        fetch("http://127.0.0.1:8080/phase1/poll").then(function (response) {
            if (response.status >= 400) {
                throw new Error("Failed to load phase 1 update from server");
            }
            return response.json();
        }).then(function (data) {
            console.log(data);
            if(data.districtUpdates === []) {
                this.endPhase1();
            }
            else {
                this.props.phase1Update(data);
            }
        });
        this.setState({phase1RunButtonDisabled: false});
    }

    endPhase1() {
        this.setState({phase1ButtonText: "Start Phase 1"});
        this.setState({phase1ControlsDisabled: false});
        this.props.togglePhase2Tab(false);
        this.setState({phase1RunButtonDisabled: false});
    }

    handlePhase1() {
        if(this.state.phase1ButtonText === "Update Phase 1") {
            console.log("Incremental");
            this.pollPhase1Incremental()
        }
        else {
            console.log("run");
            this.runPhase1();
        }
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
        if (Object.keys(updatedDemographics).length === 5) {
            this.setState({selectedMinorities: Object.entries(updatedDemographics).filter(([d, chosen]) => chosen).map(([d, chosen]) => d)})
        }
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

    resultsViewOn() {
        this.setState({resultsInView: true});
    }
    resultsViewOff() {
        this.setState({resultsInView: false});
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
                    <Button variant="contained" color="primary" disabled={this.state.phase1RunButtonDisabled}
                            onClick={this.handlePhase1} style={{width: '25vw', marginBottom: '2vw'}}>
                        {this.state.phase1ButtonText}
                    </Button>
                    <SwitchControl name="Incremental" exportIncremental={this.handleIncrementalClick}
                                   exportRealTime={this.handleRealTimeClick} disabled={this.state.phase1ControlsDisabled}/>
                    <Button variant="contained" color="primary" disabled={false}
                            style={{width: '25vw', marginTop: '2vw'}} onClick={this.resultsViewOn}>
                        View Results
                    </Button>
                    <ControlGroup id="numberDistricts">
                        <label className="label">Congressional Districts:</label>
                        <SliderControlSingleValue step={1}
                                                  exportState={this.handleNumberCongressionalDistricts} marks={marks}
                                                  min={min} max={max} disabled={this.state.phase1ControlsDisabled}/>
                    </ControlGroup>
                    <ControlGroup id="majorityMinorityDistricts">
                        <label className="label">Majority-Minority Districts</label>
                        <SliderControlSingleValue step={1} exportState={this.handleNumberMajorityMinorityDistricts} marks={marks}
                                                  min={min} max={max} disabled={this.state.phase1ControlsDisabled}/>
                    </ControlGroup>
                    <ControlGroup id="minorityPopulationThreshold">
                        <label className="label">Minority Population Thresholds:</label>
                        <SliderControlUpperLowerValues disabled={this.state.phase1ControlsDisabled}
                            exportState={this.handleMinorityPopulationThreshold}/>
                    </ControlGroup>
                    <ControlGroup id="minorityPopulationThreshold">
                        <label className="ethnicLabel">Ethnic/Racial Groups:</label>
                        <CheckboxControl exportState={this.handleSelectedDemographics} disabled={this.state.phase1ControlsDisabled}
                                    helperText="Must select at least one demographic"/>
                    </ControlGroup>
                    <ControlGroup>
                        <label className="label">Convex Hull Compactness Weighting:</label>
                        <SliderControlSingleValue min={0} max={1} step={0.01} marks={OFMarks} disabled={this.state.phase1ControlsDisabled}
                                                  exportState={this.handleConvexHullCompactnessWeight}/>
                    </ControlGroup>
                    <ControlGroup>
                        <label className="label">Reock Compactness Weighting:</label>
                        <SliderControlSingleValue min={0} max={1} step={0.01} marks={OFMarks} disabled={this.state.phase1ControlsDisabled}
                                                  exportState={this.handleReockCompactnessWeight}/>
                    </ControlGroup>
                    <ControlGroup>
                        <label className="label">Edge Compactness Weighting:</label>
                        <SliderControlSingleValue min={0} max={1} step={0.01} marks={OFMarks} disabled={this.state.phase1ControlsDisabled}
                                                  exportState={this.handleEdgeCompactnessWeight}/>
                    </ControlGroup>
                    <ControlGroup>
                        <label className="label">Efficiency Gap Weighting:</label>
                        <SliderControlSingleValue min={0} max={1} step={0.01} marks={OFMarks} disabled={this.state.phase1ControlsDisabled}
                                                  exportState={this.handleEfficiencyGapWeight}/>
                    </ControlGroup>
                    <ControlGroup>
                        <label className="label">Population Homogeneity Weighting:</label>
                        <SliderControlSingleValue min={0} max={1} step={0.01} marks={OFMarks} disabled={this.state.phase1ControlsDisabled}
                                                  exportState={this.handlePopulationHomogeneityWeight}/>
                    </ControlGroup>
                    <ControlGroup>
                        <label className="label">Population Equality Weighting:</label>
                        <SliderControlSingleValue min={0} max={1} step={0.01} marks={OFMarks} disabled={this.state.phase1ControlsDisabled}
                                                  exportState={this.handlePopulationEqualityWeight}/>
                    </ControlGroup>
                    <ControlGroup>
                        <label className="label">Partisan Fairness Weighting:</label>
                        <SliderControlSingleValue min={0} max={1} step={0.01} marks={OFMarks} disabled={this.state.phase1ControlsDisabled}
                                                  exportState={this.handlePartisanFairnessWeight}/>
                    </ControlGroup>
                    <ControlGroup>
                        <label className="label">Competitiveness Weighting:</label>
                        <SliderControlSingleValue min={0} max={1} step={0.01} marks={OFMarks} disabled={this.state.phase1ControlsDisabled}
                                                  exportState={this.handleCompetitivenessWeight}/>
                    </ControlGroup>
                    <ControlGroup>
                        <label className="label">Gerrymander Republican Weighting:</label>
                        <SliderControlSingleValue min={0} max={1} step={0.01} marks={OFMarks} disabled={this.state.phase1ControlsDisabled}
                                                  exportState={this.handleGerrymanderRepublicanWeight}/>
                    </ControlGroup>
                    <ControlGroup>
                        <label className="label">Gerrymander Democrat Weighting:</label>
                        <SliderControlSingleValue min={0} max={1} step={0.01} marks={OFMarks} disabled={this.state.phase1ControlsDisabled}
                                                  exportState={this.handleGerrymanderDemocratWeight}/>
                    </ControlGroup>
                </Phase1Styles>
            );
        }
        else {
            return(
                <Phase1Styles>
            <Button variant="contained" color="primary" style={{ width: '25vw', marginBottom: '2vw' }}
                    onClick={this.resultsViewOff}>Back to Controls</Button>
                    <h5>Majority-Minority Districts</h5>
                    <TableDisplay columns={columns} rows={this.state.majorityMinorityRows}></TableDisplay>
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

const columns = [
    { id: 'districtId', label: 'Name', },
    { id: 'population', label: 'Population', },
];
