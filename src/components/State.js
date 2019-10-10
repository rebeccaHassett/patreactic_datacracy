import React, {Component} from 'react';
import L from 'leaflet';
import {Container, Button, Tabs, Tab, Row, Col, Accordion, Image} from "react-bootstrap";
import styled from 'styled-components';
import {Link} from 'react-router-dom';
import Controls from "./Controls";
import Results_Graphs from "./Results_Graphs";
import Statistics from "./Statistics";
import Precinct from "./Precinct";
import start from '../resources/images/start.png'
import $ from 'jquery';
import Cluster from "./Cluster";

export default class State extends Component {
    constructor() {
        super();
        this.state = {
            Tab1: false,
            Tab2: false,
            Tab3: true,
            Tab4: false,
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
        var clusters_url;
        var chosen_state = window.location.pathname.split("/").pop();

        if (chosen_state === "NorthCarolina") {
            clusters_url = 'http://127.0.0.1:8080/district_geographical_data/North_Carolina/North_Carolina_U.S_Congressional_Districts_Geography.json';

            max_bounds = [
                [37, -71],               /* North East */
                [33, -85]                /* South West */
            ];
            min_zoom = 7;
        } else if (chosen_state === "RhodeIsland") {
            clusters_url = 'http://127.0.0.1:8080/district_geographical_data/Rhode_Island/Rhode_Island_U.S_Congressional_Districts_Geography.json';
            max_bounds = [
                [43, -70],
                [40, -72]
            ];
            min_zoom = 9;
        } else { /*Michigan*/
            clusters_url = 'http://127.0.0.1:8080/district_geographical_data/Michigan/Michigan_U.S._Congressional_Districts_v17a.geojson';
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

        const clusters = new Cluster();
        clusters.addClustersToState(clusters_url, this.map)
        const precincts = new Precinct(this.map, 'http://127.0.0.1:8080/precinct_geographical_data/Michigan/2016_Voting_Precincts.geojson');
        precincts.addPrecinctsToDistricts('http://127.0.0.1:8080/precinct_geographical%20data/Michigan/2016_Voting_Precincts.geojson', this.map);
        /*const precincts2 = new Precinct(this.map, 'http://127.0.0.1:8080/precinct_geographical_data/Rhode_Island/Voting_Precincts.geojson');
        precincts2.addPrecinctsToDistricts('http://127.0.0.1:8080/precinct_geographical%20data/Rhode_Island/Voting_Precincts.geojson', this.map);
        const precincts3 = new Precinct(this.map, 'http://127.0.0.1:8080/precinct_geographical_data/North_Carolina/nc_precincts.json');
        precincts3.addPrecinctsToDistricts('http://127.0.0.1:8080/precinct_geographical%20data/North_Carolina/nc_precincts.json', this.map);*/
    }

    render() {
        return (
            <State_Style>
                <Container fluid={true}>
                    <Row noGutters={true}>
                        <Col xs={6} md={3} id="col-1" >
                            <Tabs defaultActiveKey="menu">
                                <Tab eventKey="menu" title="Menu" disabled={this.state.Tab6}>
                                        <Link to='/map'>
                                            <Button>Back to US Map</Button>
                                        </Link>
                                        <Button>Import Election Data</Button>
                                        <Button>Import Boundary Data</Button>
                                        <Button disabled>Toggle to Original Districts</Button>
                                </Tab>
                                <Tab eventKey="controls" title="Controls" disabled={this.state.Tab5}>
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
                                        <body>
                                        <div id='map'></div>
                                        <Button id="startButton"><Image src={start}></Image></Button>
                                        </body>
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
        height: 50vw;
        overflow-y: scroll;
    }
    #startButton{
        position: absolute;
        right: 20px;
        padding: 10px;
        z-index: 400;
        background-image: '../resources/images/start.png'
        width: 6vw;
        border-radius: 90%;   
        background-color: limegreen;
        top: 40px;
     }
    #col-1 Button {
        width:24vw;
        margin-top: 1vw;
    }
    Button:disabled {
        background-color: blue;
    }
    
`;