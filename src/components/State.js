import React, {Component} from 'react';
import L from 'leaflet';
import {Container, Button, Tabs, Tab, Row, Col, Accordion} from "react-bootstrap";
import styled from 'styled-components';
import {Link} from 'react-router-dom';
import Controls from "./Controls";
import Results_Graphs from "./Results_Graphs";
import Statistics from "../Statistics";
import Precinct from "./Precinct";
import $ from 'jquery';

export default class State extends Component {
    constructor() {
        super();
        this.state = {
            Tab1: false,
            Tab2: false,
            Tab3: true,
            Tab4: true,
            Tab5: false,
            Tab6: false,
            Tab7: false
        }
    }

    /* Changing state of tab on/off*/
    onChangeHandler = e => {
        console.log(e.target.value);
        if (e.target.value === 'no') {
            this.setState({Tab13: true});
        } else {
            this.setState({Tab3: false});
        }
    };


    componentDidMount() {
        var max_bounds;
        var min_zoom;
        var chosen_state = window.location.pathname.split("/").pop();

        if (chosen_state === "NorthCarolina") {
            max_bounds = [
                [37, -71],               /* North East */
                [33, -85]                /* South West */
            ];
            min_zoom = 7;
        } else if (chosen_state === "RhodeIsland") {
            max_bounds = [
                [43, -70],
                [40, -72]
            ];
            min_zoom = 9;
        } else { /*Michigan*/
            max_bounds = [
                [49, -70],
                [40, -93]
            ];
            min_zoom = 6;

        }

        // create map
        this.map = L.map('map', {
            maxZoom: 20,
            minZoom: min_zoom,
            maxBounds: max_bounds,
            maxBoundsViscosity: 1.0,
            layers: [
                L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                }),
            ]
        }).fitBounds(max_bounds);

        this.map.on("zoomend", function(event) {
            if(this.getZoom() >= 8) {
                console.log("LOAD PRECINCTS");
            }
        });



        addDistrictsToState('http://127.0.0.1:8080/district_geographical_data/Rhode_Island/Rhode_Island_U.S_Congressional_Districts_Geography.json', this.map);
        addDistrictsToState('http://127.0.0.1:8080/district_geographical_data/North_Carolina/North_Carolina_U.S_Congressional_Districts_Geography.json', this.map);
        addDistrictsToState('http://127.0.0.1:8080/district_geographical_data/Michigan/Michigan_U.S._Congressional_Districts_v17a.geojson', this.map);
        const precincts = new Precinct(this.map, 'http://127.0.0.1:8080/precinct_geographical_data/Michigan/2016_Voting_Precincts.geojson');
        precincts.addPrecinctsToDistricts('http://127.0.0.1:8080/precinct_geographical%20data/Michigan/2016_Voting_Precincts.geojson', this.map);
        const precincts2 = new Precinct(this.map, 'http://127.0.0.1:8080/precinct_geographical_data/Rhode_Island/Voting_Precincts.geojson');
        precincts2.addPrecinctsToDistricts('http://127.0.0.1:8080/precinct_geographical%20data/Rhode_Island/Voting_Precincts.geojson', this.map);
        const precincts3 = new Precinct(this.map, 'http://127.0.0.1:8080/precinct_geographical_data/North_Carolina/NC_PRECINCTS_20190827.json');
        precincts3.addPrecinctsToDistricts('http://127.0.0.1:8080/precinct_geographical%20data/North_Carolina/NC_PRECINCTS_20190827.json', this.map);
    }

    render() {
        return (
            <State_Style>
                <Container fluid={true}>
                    <Row noGutters={true}>
                        <Col sm={3} id="col-1">
                            <Tabs defaultActiveKey="menu" id="tabs">
                                <Tab eventKey="menu" title="Map Menu" disabled={this.state.Tab6}>
                                    <Link to='/map'>
                                        <Button>Back to US Map</Button>
                                    </Link>
                                    <Button>Import Election Data</Button>
                                    <Button>Import Boundary Data</Button>
                                    <Button disabled>Toggle to Original Districts</Button>
                                </Tab>
                                <Tab eventKey="controls" title="Controls" disabled={this.state.Tab5}>
                                    <Button>Run</Button>
                                    <Button>Incremental Run</Button>
                                    <Button disabled>Next</Button>
                                    <Controls></Controls>
                                </Tab>
                                <Tab eventKey="statistics" title="Statistics" disabled={this.state.Tab7}>
                                    <Statistics></Statistics>
                                </Tab>
                            </Tabs>
                        </Col>
                        <Col>
                            <Tabs defaultActiveKey="map" id="tabs">
                                <Tab eventKey="map" title="Map" disabled={this.state.Tab2}>
                                    <Container>
                                        <div id='map'></div>
                                    </Container>
                                </Tab>
                                <Tab eventKey="results" title="Results" disabled={this.state.Tab4}>
                                    <Results_Graphs></Results_Graphs>
                                </Tab>
                            </Tabs>
                        </Col>
                    </Row>
                </Container>
            </State_Style>
        );
    }
}

const State_Style = styled.div`
    #map {
      height: 600px;
    }
    #col-1 {
        background-color:  lightgray;
    }
    Button {
        width:24vw;
        background-color: limegreen;
    }
    
`;

function addDistrictsToState(url, map) {
    var layer;

    var district_style = {
        "color": "green"
    };

    var state = $.ajax({
        url: url,
        dataType: "json",
        success: console.log("State data successfully loaded."),
        fail: function (xhr) {
            alert(xhr.statusText)
        }
    })


    $.when(state).done(function () {
            layer = L.geoJSON(state.responseJSON, {style: district_style}).addTo(map);
            layer.bringToFront();
    });
}