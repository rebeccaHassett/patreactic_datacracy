import React, {Component} from 'react';
import {Bar} from "react-chartjs-2";
import {MDBContainer} from "mdbreact";
import styled from "styled-components";

export default class BarChart extends Component {
    state = {
        barChartOptions: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                xAxes: [
                    {
                        barPercentage: 1,
                        gridLines: {
                            display: true,
                            color: "rgba(0, 0, 0, 0.1)"
                        }
                    }
                ],
                yAxes: [
                    {
                        gridLines: {
                            display: true,
                            color: "rgba(0, 0, 0, 0.1)"
                        },
                        ticks: {
                            beginAtZero: false
                        }
                    }
                ]
            }
        }
    }

    render() {
        return (
            <Chart_Styles>
                <MDBContainer id="chart">
                    <h3 className="mt-5"></h3>
                    <Bar data={this.props.databar} options={this.state.barChartOptions}/>
                </MDBContainer>
            </Chart_Styles>
        );
    }
}

const Chart_Styles = styled.div`
    #chart {
        width:20vw;
        height: 20vw;
        float: left;
        margin-top: 0vw;
        margin-bottom: 6vw;
    }
`;
