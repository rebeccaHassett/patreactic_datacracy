import React, {Component} from 'react';
import {Container} from '@material-ui/core';
import BarChart from "./BarChart";
import PieChart from "./graphs/PieChart";
import ElectionButtonsControl from "./controls/ElectionButtonsControl";
import {Form} from "react-bootstrap";
import styled from "styled-components";


export default class Statistics extends Component {
    constructor() {
        super();
        this.state = {
            electionType: 'Presidential',
            electionYear: '2016',
            election: 'Presidential 2016',
        }
        this.handleElectionChanges = this.handleElectionChanges.bind(this);
    }


    handleElectionChanges(event) {
        if(event.target.value  === "Congressional 2016") {
            this.setState({
                election: 'Congressional 2016'
            })
            this.setState({
                electionYear: '2016'
            })
            this.setState({
                electionType: 'Congressional'
            })
        }
        else if(event.target.value  === "Congressional 2018") {
            this.setState({
                election: 'Congressional 2018'
            })
            this.setState({
                electionYear: '2018'
            })
            this.setState({
                electionType: 'Congressional'
            })
        }
        else if(event.target.value  === "Presidential 2016") {
            this.setState({
                election: 'Presidential 2016'
            })
            this.setState({
                electionYear: '2016'
            })
            this.setState({
                electionType: 'Presidential'
            })
        }
    }

    render() {
        var data = this.props.data;
        if (data === "") {
            return null;
        } else {
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
                labels: ["African American", "Asian", "Hispanic", "White", "Native American"],
                datasets: [
                    {
                        data: [africanAmericanPopulation, asianPopulation, hispanicPopulation, whitePopulation, nativeAmericanPopulation],
                        backgroundColor: [
                            "#e3c878",
                            "#ed9a73",
                            "#88A1E6",
                            '#bbeaa6',
                            "#e688a1",

                        ],
                        hoverBackgroundColor: [
                            "#e3c878",
                            "#ed9a73",
                            "#88A1E6",
                            '#bbeaa6',
                            "#e688a1",
                        ]
                    }
                ]
            }

            var republicanVotes;
            var republicanCandidate;
            var democraticVotes;
            var democraticCandidate;
            if (this.state.electionType === "Presidential") {
                republicanVotes = jsonData.PRES16R;
                republicanCandidate = "Donald Trump";
                democraticVotes = jsonData.PRES16D;
                democraticCandidate = "Hillary Clinton";
            } else {
                var voting_data;
                if (this.state.electionYear === '2016') {
                    voting_data = jsonData.HOUSE_ELECTION_16;
                } else {
                    voting_data = jsonData.HOUSE_ELECTION_18;
                }
                var republicanKey;
                var democraticKey;
                for (var key in voting_data) {
                    if (key[key.length - 1] === 'D') {
                        democraticKey = key;
                    } else if (key[key.length - 1] === 'R') {
                        republicanKey = key;
                    }
                }
                republicanCandidate = republicanKey.substring(0, republicanKey.length - 1);
                democraticCandidate = democraticKey.substring(0, democraticKey.length - 1);
                republicanVotes = voting_data[republicanKey];
                democraticVotes = voting_data[democraticKey];
            }

            var dataPieParty = {
                labels: ["Republican", "Democrat"],
                datasets: [
                    {
                        data: [republicanVotes, democraticVotes],
                        backgroundColor: [
                            "rgba(245,  0, 87, 1)",
                            "rgba(30, 144,255,1)",
                        ],
                        hoverBackgroundColor: [
                            "rgba(245,  0, 87, 0.5)",
                            "rgba(30, 144,255,0.5)",
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
                            "rgba(245,  0, 87, 1)",
                            "rgba(30, 144,255,0.5)",
                        ],
                        borderWidth: 2,
                        borderColor: [
                            "rgba(245,  0, 87, 1)",
                            "rgba(30, 144,255,0.5)",
                        ]
                    }
                ]
            }
        }

        function wordCase(str) {
            var splitStr = str.toLowerCase().split(' ');
            for (var i = 0; i < splitStr.length; i++) {

                splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
            }
            return splitStr.join(' ');
        }

        return (
            <StatisticsStyles>
                <Form>
                    <Form.Group>
                        <h3 className="bolden">Election Data</h3>
                <ElectionButtonsControl exportState={this.handleElectionChanges}/>
                    </Form.Group>
                    <h4 className="bolden"> {wordCase(name)}</h4>
                    <h4 className="label">{wordCase(this.state.electionType)} {this.state.electionYear}</h4>
                <h5>{democraticCandidate}, Dem, {democraticVotes.toLocaleString()}</h5>
                <h5>{republicanCandidate}, Rep, {republicanVotes.toLocaleString()}</h5>
                <h4>Votes Per Party</h4>
                <PieChart dataPie={dataPieParty}/>
                <h4>Votes Per Candidate</h4>
                    <BarChart databar={databar}/>
                <h4>Demographic Data</h4>
                <p>Total Population: {Math.round(totalPopulation).toLocaleString()}</p>
                <p>Hispanic Population: {Math.round(hispanicPopulation).toLocaleString()}</p>
                <p>White Population: {Math.round(whitePopulation).toLocaleString()}</p>
                <p>African American Population: {Math.round(africanAmericanPopulation).toLocaleString()}</p>
                <p>Native American Population: {Math.round(nativeAmericanPopulation).toLocaleString()}</p>
                <p>Asian Population: {Math.round(asianPopulation).toLocaleString()}</p>
                <PieChart dataPie={dataPie}/>
            </Form>
            </StatisticsStyles>
        );
    };
}

const StatisticsStyles = styled.div`
    h4 {
        margin-top: 2vw;
        margin-bottom: 1vw;
    }

    .bolden {
      font-weight: bold;
      text-decoration: underline;
      
    }   
    .prename {
        font-weight: bold;
    }

 `;