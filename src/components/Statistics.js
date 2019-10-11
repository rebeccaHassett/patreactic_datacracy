import React, {Component} from 'react';
import {ButtonGroup, Button, Container, Row, Col} from "react-bootstrap";
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
                <h4>District 2 Election Results:</h4>
                <h5>County: Burrillville</h5>
                <h5>Total Voters: 6750</h5>
                <h5>Voting Results Per Candidate</h5>
                <p>James R. Langevin, DEM, 3401</p>
                <p>Rhue R. Reis, REP, 2496</p>
                <p>Jeffrey C. Johnson, IND, 653</p>
                <p>Salvatore G. Caiozzo, IND, 188</p>
                <h5>Demographic Data</h5>
                <Bar_Chart databar={databar}></Bar_Chart>
                <Pie_Chart dataPie={dataPie}></Pie_Chart>
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

var databar =  {
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