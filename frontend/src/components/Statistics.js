import React, {Component} from 'react';
import {ButtonGroup, Button, Row, Col} from "react-bootstrap";
import styled from "styled-components";
import Bar_Chart from "./Bar_Chart";
import Pie_Chart from "./Pie_Chart";


export default class Statistics extends Component {
    constructor() {
        super();
        this.state = {
            electionType: 'Presidential',
            electionYear: '2016',
            button2018: true
        }
    }

    _onElectionTypeChange(option) {
        if(option === "Congressional") {
            this.setState({
               button2018: false
            });
        }
        else {
            this.setState({
                button2018: true
            });
            this.setState({
                electionYear: '2016'
            })
        }
        this.setState({
            electionType: option
        });
    }

    _onElectionYearChange(option) {
        this.setState({
            electionYear: option
        });
    }

    render() {
        var data = this.props.data;
        if(data !== "") {
            var jsonData = JSON.parse(data);
            var name = jsonData.PRENAME;
            var totalPopulation = jsonData.VAP;
            var hispanicPopulation = jsonData.HVAP;
            var whitePopulation = jsonData.WVAP;
            var africanAmericanPopulation = jsonData.BVAP;
            var nativeAmericanPopulation = jsonData.AMINVAP;
            var asianPopulation = jsonData.ASIANVAP;
            var pacificIslanderPopulation = jsonData.NHPIVAP;


            var dataPie = {
                labels: ["African American", "Asian", "Hispanic", "White", "Native American", "Pacific Islander"],
                datasets: [
                    {
                        data: [africanAmericanPopulation, asianPopulation, hispanicPopulation, whitePopulation, nativeAmericanPopulation, pacificIslanderPopulation],
                        backgroundColor: [
                            "#F7464A",
                            "#46BFBD",
                            "#FDB45C",
                            "#949FB1",
                            '#00A6B4',
                            '#6800B4'

                        ],
                        hoverBackgroundColor: [
                            "#FF5A5E",
                            "#5AD3D1",
                            "#FFC870",
                            "#A8B3C5",
                            '#00A6B4',
                            '#6800B4'
                        ]
                    }
                ]
            }

            var republicanVotes;
            var republicanCandidate;
            var democraticVotes;
            var democraticCandidate;
            if(this.state.electionType === "Presidential") {
                republicanVotes = jsonData.PRES16R;
                republicanCandidate = "Donald Trump";
                democraticVotes = jsonData.PRES16D;
                democraticCandidate = "Hillary Clinton";
            }
            else {
                var voting_data;
                if(this.state.electionYear === '2016') {
                    voting_data = jsonData.HOUSE_ELECTION_16;
                }
                else {
                    voting_data = jsonData.HOUSE_ELECTION_18;
                }
                var republicanKey;
                var democraticKey;
                for(var key in voting_data) {
                    if(key[key.length -1] === 'D') {
                        democraticKey = key;
                    }
                    else if(key[key.length - 1] === 'R') {
                        republicanKey = key;
                    }
                }
                republicanCandidate = republicanKey.substring(0, republicanKey.length - 1);
                democraticCandidate = democraticKey.substring(0, democraticKey.length - 1);
                republicanVotes = voting_data.republicanKey;
                democraticVotes = voting_data.democraticKey;
            }

            var dataPieParty = {
                labels: ["Republican","Democrat"],
                datasets: [
                    {
                        data: [republicanVotes, democraticVotes],
                        backgroundColor: [
                            "#FF0000",
                            "#0000FF",
                        ],
                        hoverBackgroundColor: [
                            "#FF5A5E",
                            "#5AD3D1",
                        ]
                    }
                ]
            }

            var databar = {
                labels: [republicanCandidate, democraticCandidate],
                datasets: [
                    {
                        label: "Number of Votes",
                        data: [republicanVotes, democraticVotes],
                        backgroundColor: [
                            "rgba(255, 134,159,0.4)",
                            "rgba(98,  182, 239,0.4)",
                        ],
                        borderWidth: 2,
                        borderColor: [
                            "rgba(255, 134, 159, 1)",
                            "rgba(98,  182, 239, 1)",
                        ]
                    }
                ]
            }


        }
        return (
            <Statistics_Style>
                <Row>
                    <Col>
                        <ButtonGroup aria-label="Basic example" id="btns">
                            <Button onClick={this._onElectionTypeChange.bind(this, 'Presidential')} active={this.state.electionType === 'Presidential'}>Presidential</Button>
                            <Button onClick={this._onElectionTypeChange.bind(this, 'Congressional')} active={this.state.electionType === 'Congressional'}>Congressional</Button>
                        </ButtonGroup>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <ButtonGroup aria-label="Basic example" id="btns2">
                            <Button onClick={this._onElectionYearChange.bind(this, '2016')} active={this.state.electionYear === '2016'}>2016</Button>
                            <Button onClick={this._onElectionYearChange.bind(this, '2018')} active={this.state.electionYear === '2018'} disabled={this.state.button2018}>2018</Button>
                        </ButtonGroup>
                    </Col>
                </Row>
                <h4>{name}</h4>
                <h4>{this.state.electionType} {this.state.electionYear}</h4>
                <h5>Voting Results Per Candidate</h5>
                <p>{democraticCandidate}, DEM, {democraticVotes}</p>
                <p>{republicanCandidate}, REP, {republicanVotes}</p>
                <h5>Voters Per Party</h5>
                <Pie_Chart dataPie={dataPieParty}></Pie_Chart>
                <h5>Voters Per Candidate</h5>
                <Bar_Chart databar={databar}></Bar_Chart>
                <h5>Demographic Data</h5>
                <p>Total Population: {Math.round(totalPopulation)}</p>
                <p>Hispanic Population: {Math.round(hispanicPopulation)}</p>
                <p>White Population: {Math.round(whitePopulation)}</p>
                <p>African American Population: {Math.round(africanAmericanPopulation)}</p>
                <p>Native American Population: {Math.round(nativeAmericanPopulation)}</p>
                <p>Asian Population: {Math.round(asianPopulation)}</p>
                <p>Pacific Islander Population: {Math.round(pacificIslanderPopulation)}</p>
                <Pie_Chart dataPie={dataPie}></Pie_Chart>
            </Statistics_Style>

        );
    };
}

const Statistics_Style = styled.div`
    * {
        color: lightblue;
    }
    #btns, #btns2 {
      width:4vw;
    }
    #btns2 {
        margin-bottom: 2vw;
    }
    h4 {
        margin-bottom: 2vw;
    }
`;