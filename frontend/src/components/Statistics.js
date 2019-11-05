import React, {Component} from 'react';
import {ButtonGroup, Button, Row, Col} from "react-bootstrap";
import styled from "styled-components";
import Bar_Chart from "./Bar_Chart";
import Pie_Chart from "./Pie_Chart";


export default class Statistics extends Component {
    render() {
        return (
            <Statistics_Style>
                <Row>
                    <Col>
                        <ButtonGroup aria-label="Basic example" id="btns">
                            <Button variant="secondary">Presidential</Button>
                            <Button variant="secondary">Congressional</Button>
                        </ButtonGroup>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <ButtonGroup aria-label="Basic example" id="btns2">
                            <Button variant="secondary">2016</Button>
                            <Button variant="secondary">2018</Button>
                        </ButtonGroup>
                    </Col>
                </Row>
                { this.props.sign === true ? <h4>District 2 Election Results:</h4> : <h4>District 10 Election Results:</h4>}
                { this.props.sign === true ? <h5>County: Burrillville</h5> : <h5>County: Greenbush</h5>}
                { this.props.sign === true ? <h5>Total Voters: 6750</h5> : <h5>Total Voters: 153437</h5>}
                <h5>Voting Results Per Candidate</h5>
                { this.props.sign === true ? <p>James R. Langevin, DEM, 3401</p> : <p>Thomas, 3424</p>}
                { this.props.sign === true ? <p>Rhue R. Reis, REP, 2496</p> : <p>Andrew, 3426</p>}
                { this.props.sign === true ? <p>Jeffrey C. Johnson, IND, 653</p> : <p>Lauren, 233343</p>}
                { this.props.sign === true ? <p>Salvatore G. Caiozzo, IND, 188</p> : <p>Rebecca, 123244</p>}
                <h5>Voters Per Party</h5>
                { this.props.sign === true ? <Pie_Chart dataPie={dataPieParty1}></Pie_Chart> : <Pie_Chart dataPie={dataPieParty2}></Pie_Chart>}
                <h5>Voters Per Candidate</h5>
                { this.props.sign === true ? <Bar_Chart databar={databar}></Bar_Chart> : <Bar_Chart databar={databar2}></Bar_Chart>}
                <h5>Demographic Data</h5>
                { this.props.sign === true ? <Pie_Chart dataPie={dataPie}></Pie_Chart> : <Pie_Chart dataPie={dataPie2}></Pie_Chart>}
            </Statistics_Style>

        );
    };
}

/*<h3>Influence Districts</h3>*/
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

var dataPie = {
    labels: ["African American", "Asian", "Hispanic", "White"],
    datasets: [
        {
            data: [53040, 23006, 117819, 460033],
            backgroundColor: [
                "#F7464A",
                "#46BFBD",
                "#FDB45C",
                "#949FB1",
            ],
            hoverBackgroundColor: [
                "#FF5A5E",
                "#5AD3D1",
                "#FFC870",
                "#A8B3C5",
            ]
        }
    ]
}

var dataPie2 = {
    labels: ["African American", "Asian", "Hispanic", "White"],
    datasets: [
        {
            data: [345453, 120, 11783, 6924342],
            backgroundColor: [
                "#F7464A",
                "#46BFBD",
                "#FDB45C",
                "#949FB1",
            ],
            hoverBackgroundColor: [
                "#FF5A5E",
                "#5AD3D1",
                "#FFC870",
                "#A8B3C5",
            ]
        }
    ]
}

var dataPieParty1 = {
    labels: ["Republican","Democrat"],
    datasets: [
        {
            data: [35, 65],
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


var dataPieParty2 = {
    labels: ["Republican", "Democrat"],
    datasets: [
        {
            data: [40, 60],
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
    labels: ["James R. Langevin", "Rhue R. Reis", "Jeffrey C. Johnson", "Salvatore G. Caiozzo"],
    datasets: [
        {
            label: "Number of Votes",
            data: [3401, 2496, 653, 188],
            backgroundColor: [
                "rgba(255, 134,159,0.4)",
                "rgba(98,  182, 239,0.4)",
                "rgba(255, 218, 128,0.4)",
                "rgba(113, 205, 205,0.4)",
            ],
            borderWidth: 2,
            borderColor: [
                "rgba(255, 134, 159, 1)",
                "rgba(98,  182, 239, 1)",
                "rgba(255, 218, 128, 1)",
                "rgba(113, 205, 205, 1)",
            ]
        }
    ]
}

var databar2 = {
    labels: ["Thomas", "Andrew", "Lauren", "Rebecca"],
    datasets: [
        {
            label: "Number of Votes",
            data: [3424, 3426, 23343, 123244],
            backgroundColor: [
                "rgba(255, 134,159,0.4)",
                "rgba(98,  182, 239,0.4)",
                "rgba(255, 218, 128,0.4)",
                "rgba(113, 205, 205,0.4)",
            ],
            borderWidth: 2,
            borderColor: [
                "rgba(255, 134, 159, 1)",
                "rgba(98,  182, 239, 1)",
                "rgba(255, 218, 128, 1)",
                "rgba(113, 205, 205, 1)",
            ]
        }
    ]
}