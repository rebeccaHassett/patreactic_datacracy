import React, {Component} from 'react';
import L from 'leaflet';
import {Container, Button, Tabs, Tab, Row, Col} from "react-bootstrap";
import styled from 'styled-components';
import {Link} from 'react-router-dom';
import Controls from "./Controls";
import Results_Graphs from "./Results_Graphs";
import Statistics from "../Statistics";
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
        var map_test;
        var max_bounds;
        var chosen_state = window.location.pathname.split("/").pop();

        if (chosen_state === "NorthCarolina") {
            max_bounds = [
                [36, -81],
                [33, -80]
            ];
        } else if (chosen_state === "RhodeIsland") {
            max_bounds = [
                [41, -72],
                [42, -71]
            ];
        } else { /*Michigan*/
            max_bounds = [
                [41.5, -90.6],
                [48, -79.5]
            ];
        }

        // create map
        this.map = L.map('map', {
            center: [0, 0],
            zoom: 5,
            maxBounds: max_bounds,
            layers: [
                L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                }),
            ]
        }).fitBounds(max_bounds);

        addDistrictsToState('http://127.0.0.1:8080/district_geographical_data/Rhode_Island/Rhode_Island_U.S_Congressional_Districts_Geography.json', this.map);
        addDistrictsToState('http://127.0.0.1:8080/district_geographical_data/North_Carolina/North_Carolina_U.S_Congressional_Districts_Geography.json', this.map);
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
            layer.bringToBack();
    });
}