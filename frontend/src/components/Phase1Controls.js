import React, { Component } from 'react';
import SliderControlUpperLowerValues from "./controls/SliderControlUpperLowerValues";
import SliderControlSingleValue from "./controls/SliderControlSingleValue";
import SwitchControl from "./controls/SwitchControl";
import CheckboxControl from "./controls/CheckboxControl";
import AlertControl from "./controls/AlertControl";
import styled from 'styled-components';
import Button from '@material-ui/core/Button';

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
    }

    state = {
        numCongressionalDistricts: 0,
        numMajorityMinorityDistricts: 0,
        minorityPopulationThresholdValues: [],
        incremental: false,
        realtime: false,
        selectedMinorities: []
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
            /*error*/
        }

        this.props.removeOGDisrtricts();

        this.initializeClusters();


        var phase1Dto = {
            config: {
                thresholds: [{
                    name: "MINORITY_PERCENTAGE",
                    lower: this.state.minorityPopulationThresholdValues[0] / 100.0,
                    upper: this.state.minorityPopulationThresholdValues[1] / 100.0
                }],
                weights: {},
                incremental: this.state.incremental,
                realtime: this.state.realtime,
                numDistricts: this.state.numCongressionalDistricts,
                numMajMinDistricts: this.state.numMajorityMinorityDistricts,
                selectedMinorities: this.state.selectedMinorities,
                year: this.state.electionYear,
                type: this.state.electionType
            },
            state: this.props.state,
        };

        const response = await fetch("http://127.0.0.1:8080/runPhase1", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(phase1Dto),
        })

        //var updatedPrecinctFeatures = []



        //this.props.handlePrecinctFeatures(updatedPrecinctFeatures);
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

        return (
            <Phase1Styles>
                <Button variant="contained" color="primary" onClick={this.runPhase1} style={{ width: '20vw', marginBottom: '2vw' }}>Start Phase 1</Button>
                <SwitchControl name="Incremental" exportIncremental={this.handleIncrementalClick} exportRealTime={this.handleRealTimeClick} />
                <ControlGroup id="numberDistricts">
                    <label className="label">Congressional Districts:</label>
                    <SliderControlSingleValue
                        exportState={this.handleNumberCongressionalDistricts} marks={marks} min={min} max={max}></SliderControlSingleValue>
                </ControlGroup>
                <ControlGroup id="majorityMinorityDistricts">
                    <label className="label">Majority-Minority Districts</label>
                    <SliderControlSingleValue
                        exportState={this.handleNumberMajorityMinorityDistricts} marks={marks} min={min} max={max}></SliderControlSingleValue>
                </ControlGroup>
                <ControlGroup id="minorityPopulationThreshold">
                    <label className="label">Minority Population Thresholds:</label>
                    <SliderControlUpperLowerValues
                        exportState={this.handleMinorityPopulationThreshold}></SliderControlUpperLowerValues>
                </ControlGroup>
                <ControlGroup id="minorityPopulationThreshold">
                    <label className="ethnicLabel">Ethnic/Racial Groups:</label>
                    <CheckboxControl exportState={this.handleSelectedDemographics}></CheckboxControl>
                </ControlGroup>
            </Phase1Styles>
        );
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