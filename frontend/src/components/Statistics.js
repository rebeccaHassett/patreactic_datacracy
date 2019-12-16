import React, {Component} from 'react';
import BarChart from "./graphs/BarChart";
import PieChart from "./graphs/PieChart";
import styled from "styled-components";
import TableDisplay from "./controls/TableDisplay";


export default class Statistics extends Component {

    render() {
        var data = this.props.data;
        if (data === "" || data === null) {
            return null;
        } else {
            let jsonData;
            if (typeof (data) === 'string') {
                jsonData = JSON.parse(data);
            } else {
                jsonData = data;
            }
            var name;
            if (this.props.type === "district") {
                name = "Congressional District " + jsonData.PRENAME;
            } else {
                name = jsonData.PRENAME;
            }
            if(this.props.type === "precinct" && !(this.props.chosenState === "Michigan") ) {
                name = jsonData.PRENAME + ", " + jsonData.COUNTY + " County";
            }
            var totalPopulation = jsonData.VAP;
            var hispanicPopulation = jsonData.HVAP;
            var whitePopulation = jsonData.WVAP;
            var africanAmericanPopulation = jsonData.BVAP;
            var nativeAmericanPopulation = jsonData.AMINVAP;
            var asianPopulation = jsonData.ASIANVAP;

            function createData(demographic, population, total) {
                let percentage = ((population / total) * 100);
                return {demographic, population, percentage};
            }

            var rows = [
                createData("White", whitePopulation, totalPopulation),
                createData('Black', africanAmericanPopulation, totalPopulation),
                createData('Asian', asianPopulation, totalPopulation),
                createData('Hispanic', hispanicPopulation, totalPopulation),
                createData('Native American', nativeAmericanPopulation, totalPopulation),
            ];


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
            };

            var republicanVotes;
            var republicanCandidate;
            var democraticVotes;
            var democraticCandidate;
            if (this.props.election.split(" ")[0] === "Presidential") {
                republicanVotes = jsonData.PRES16R;
                republicanCandidate = "Republican Donald Trump";
                democraticVotes = jsonData.PRES16D;
                democraticCandidate = "Democrat Hillary Clinton";
            } else {
                var voting_data;
                if (this.props.election.split(" ")[1] === '2016') {
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
                republicanVotes = voting_data[republicanKey];
                democraticVotes = voting_data[democraticKey];
                democraticCandidate = "Democratic Candidate";
                republicanCandidate = "Republican Candidate";
            }

            var databar = {
                labels: ["Republican", "Democrat"],
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
                <h4 className="bolden"> {wordCase(name)}</h4>
                <h4 className="label">{wordCase(this.props.election.split(" ")[0])} {this.props.election.split(" ")[1]}</h4>
                <h4 className="bolden">Votes Per Party</h4>
                <h5>{democraticCandidate}: {democraticVotes.toLocaleString()} votes</h5>
                <h5>{republicanCandidate}: {republicanVotes.toLocaleString()} votes</h5>
                <BarChart databar={databar}/>
                <h4>Total Population: {Math.round(totalPopulation).toLocaleString()}</h4>
                <h4 className="bolden">Demographic Data</h4>
                <TableDisplay columns={columns} rows={rows}/>
                <PieChart dataPie={dataPie}/>
            </StatisticsStyles>
        );
    };
}

const columns = [
    {id: 'demographic', label: 'Demographic',},
    {
        id: 'population',
        label: 'Population',
        format: value => value.toLocaleString(),
    },
    {
        id: 'percentage',
        label: '%',
        format: value => value.toLocaleString(),
    },
];


const StatisticsStyles = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    h4 {
        margin-top: 1vw;
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