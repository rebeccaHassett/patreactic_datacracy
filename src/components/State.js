import React, {Component} from 'react';
import L from 'leaflet';
import {Container, Button, Tabs, Tab, Row, Col, ButtonToolbar, DropdownButton, SplitButton, Dropdown} from "react-bootstrap";
import styled from 'styled-components';
import {Link} from 'react-router-dom';
import Controls from "./Controls";
import Results_Graphs from "./Results_Graphs";
import Statistics from "../Statistics";
import State_Borders from "../resources/GeoJSON/State_Borders";
import Michigan from "../resources/GeoJSON/Michigan";
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

    setStateDistrictLayers = (chosen_state) => {

    }


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

        map_test = this.map;

        var precinct_style = {
            "color": "green"
        };

        var precinct_layer;

        const url = 'http://172.25.81.185:8080/North_Carolina_U.S_Congressional_Districts_Geography.json';
/*        fetch(url)
            .then(response => response.text())
            .then(contents => precinct_layer = contents)
            .catch(() => console.log("Can’t access " + url + " response. Blocked by browser?"))*/




            //Fetch the geojson file


                var layer;
                var districts = $.ajax({
                    url: url,
                    dataType: "json",
                    success: console.log("County data successfully loaded."),
                    fail: function(xhr) {
                        alert(xhr.statusText)
                    }
                })


                $.when(districts).done(function() {
                    console.log(districts.responseJSON);
                    layer = L.geoJSON(districts.responseJSON, {style: precinct_style}).addTo(map_test);
                    console.log(layer);
                });

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

function fetchJSON(url) {
    return fetch(url)
        .then(function (response) {
            return response.json();
        });
}