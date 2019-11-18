import React from "react";
import { Pie } from "react-chartjs-2";
import { MDBContainer } from "mdbreact";
import styled from "styled-components";

export default class Pie_Chart extends React.Component {
    render() {
        return (
            <Pie_Chart_Styles>
            <MDBContainer>
                <Pie data={this.props.dataPie} options={option} id="pie"/>
            </MDBContainer>
            </Pie_Chart_Styles>
        );
    }
}
const option = {
    fontSize: 2,
    tooltips: {
        callbacks: {
            label: function(tooltipItem, data) {
                var dataset = data.datasets[tooltipItem.datasetIndex];
                var meta = dataset._meta[Object.keys(dataset._meta)[0]];
                var total = meta.total;
                var currentValue = dataset.data[tooltipItem.index];
                var percentage = parseFloat((currentValue/total*100).toFixed(1));
                return currentValue + ' (' + percentage + '%)';
            },
            title: function(tooltipItem, data) {
                return data.labels[tooltipItem[0].index];
            }
        }
    }
}

const Pie_Chart_Styles = styled.div`
    #pie {
        width:20vw;
        height:20vw;
        float: left;
    }
`;