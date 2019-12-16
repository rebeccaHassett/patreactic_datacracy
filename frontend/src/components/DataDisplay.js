import React from 'react';
import DataTabs from "./DataTabs";

class DataDisplay extends React.Component {
    constructor() {
        super();
        this.setIncumbents = this.setIncumbents.bind(this);
        this.setLaws = this.setLaws.bind(this);
    }

    state = {
        laws: "",
        incumbents: [['-', '-']]
    };

    createData(districtId, incumbent) {
        return {districtId, incumbent};
    }

    setIncumbents(data) {
        let map = [];
        data.forEach(incumbent => {
            map.push(this.createData(incumbent.districtId, incumbent.incumbent))
        });

        this.setState({incumbents: map});
    }

    setLaws(data) {
        this.setState({laws: data.laws});
    }

    componentDidMount() {
        fetch('http://127.0.0.1:8080/laws/' + this.props.chosenState).then(function (response) {
            if (response.status >= 400) {
                console.log("Law data not loaded from server successfully");
            }
            return response.json();
        }).then(this.setLaws);

        fetch('http://127.0.0.1:8080/incumbent/' + this.props.chosenState).then(function (response) {
            if (response.status >= 400) {
                console.log("Incumbent data not loaded from server successfully");
            }
            return response.json();
        }).then(this.setIncumbents);
    }

    render() {
        return (
            <DataTabs stateData={this.props.stateData} districtData={this.props.districtData}
                      precinctData={this.props.precinctData}
                      incumbents={this.state.incumbents} laws={this.state.laws}
                      loadOriginalDistricts={this.props.loadOriginalDistricts}
                      removeOriginalDistricts={this.props.removeOriginalDistricts}
                      demographicMapUpdate={this.props.demographicMapUpdate}
                      demographicMapUpdateSelection={this.props.demographicMapUpdateSelection}
                      election={this.props.election} chosenState={this.props.chosenState} districtToggleDisabled={this.props.districtToggleDisabled}
                    phase0ControlsTabDisabled={this.props.phase0ControlsTabDisabled} demographicsSelected={this.props.demographicsSelected}
                    demographicDistributionDisabled={this.props.demographicDistributionDisabled}
                      originalDistrictDataMap={this.props.originalDistrictDataMap}/>
        );
    }
}


export default DataDisplay;