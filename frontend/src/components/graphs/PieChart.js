import React from "react";
import {Pie} from "react-chartjs-2";
import {MDBContainer} from "mdbreact";

export default class PieChart extends React.Component {
    render() {
        return (
            <MDBContainer style={{marginTop: "3vw", width: '100%'}}>
                <Pie data={this.props.dataPie} options={option} id="pie"/>
            </MDBContainer>
        );
    }
}
const option = {
    width: 20,
    height: 20,
    fontSize: 2,
    tooltips: {
        callbacks: {
            label: function (tooltipItem, data) {
                var dataset = data.datasets[tooltipItem.datasetIndex];
                var meta = dataset._meta[Object.keys(dataset._meta)[0]];
                var total = meta.total;
                var currentValue = dataset.data[tooltipItem.index];
                var percentage = parseFloat((currentValue / total * 100).toFixed(1));
                return currentValue + ' (' + percentage + '%)';
            },
            title: function (tooltipItem, data) {
                return data.labels[tooltipItem[0].index];
            }
        }
    }
}