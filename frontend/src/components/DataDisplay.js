import React from 'react';
import styled from "styled-components";
import DataTabs from "./controls/DataTabs";

class DataDisplay extends React.Component {
    constructor() {
        super();
    }

    state = {
        laws: "",
        incumbents: ""
    }

    componentDidMount() {
        console.log(this.props.chosenState);
        this.state.laws = fetch('http://127.0.0.1:8080/laws/' + this.props.chosenState).then(function (response) {
            if (response.status >= 400) {
                console.log("Law data not loaded from server successfully");
            }
            return response.json();
        }).then(function (data) {
            return data.laws;
        });

        this.state.incumbents = fetch('http://127.0.0.1:8080/incumbent/' + this.props.chosenState).then(function (response) {
            if (response.status >= 400) {
                console.log("Incumbent data not loaded from server successfully");
            }
            return response.json();
        }).then(function (data) {
            return data;
        });
    }

    render() {
        return (
            <DataTabs stateData={this.props.stateData} districtData={this.props.districtData}
                      precinctData={this.props.precinctData}
            incumbents={""} laws={"Districts must be contiguous, compact, and have equal population"}/>
        );
    }
}


export default DataDisplay;