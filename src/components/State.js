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
import Sidebar from "./Sidebar";
import menu from '../resources/images/menu.png'

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
            Tab7: false,
            Sidebar: true
        }
        this.toggleBox = this.toggleBox.bind(this);
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

    toggleBox() {
        this.setState(oldState => ({Sidebar: !oldState.Sidebar}));
    }

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

        this.map.on("zoomend", function (event) {
            if (this.getZoom() >= 8) {
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
                <Row>
                    <div id="content">

                        <Button id="sidebarCollapse" className="btn btn-info" onClick={this.toggleBox} img src={menu}>
                            <i className="fas fa-align-left"></i>
                            Menu
                        </Button>

                    </div>
                    {this.state.Sidebar ? <Sidebar/> : null}
                    <Col>
                        <Tabs defaultActiveKey="map" id="tabs">
                            <Tab title="Michigan" disabled>
                            </Tab>
                            <Tab eventKey="map" title="Map" disabled={this.state.Tab2}>
                                <Container>
                                    <body>
                                    <div id='map'></div>
                                    </body>
                                </Container>
                            </Tab>
                            <Tab eventKey="results" title="Results" disabled={this.state.Tab4}>
                                <Results_Graphs></Results_Graphs>
                            </Tab>
                        </Tabs>
                    </Col>
                </Row>
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
    #content{
        position: absolute;
        float:left;
        z-index: 400;
        left: 0.5vw;
        width: 10vw;
     }
    #col-1 Button {
        width:24vw;
        margin-top: 1vw;
    }
    Button:disabled {
        background-color: blue;
    }
    
`;

const Sidebar_Style = styled.div`
 @import "https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700";


body {
    font-family: 'Poppins', sans-serif;
    background: #fafafa;
}

p {
    font-family: 'Poppins', sans-serif;
    font-size: 1.1em;
    font-weight: 300;
    line-height: 1.7em;
    color: #999;
}

a, a:hover, a:focus {
    color: inherit;
    text-decoration: none;
    transition: all 0.3s;
}

#sidebar {
    /* don't forget to add all the previously mentioned styles here too */
    background: #7386D5;
    color: #fff;
    transition: all 0.3s;
}

#sidebar .sidebar-header {
    padding: 20px;
    background: #6d7fcc;
}

#sidebar ul.components {
    padding: 20px 0;
    border-bottom: 1px solid #47748b;
}

#sidebar ul p {
    color: #fff;
    padding: 10px;
}

#sidebar ul li a {
    padding: 10px;
    font-size: 1.1em;
    display: block;
}
#sidebar ul li a:hover {
    color: #7386D5;
    background: #fff;
}

#sidebar ul li.active > a, a[aria-expanded="true"] {
    color: #fff;
    background: #6d7fcc;
}
ul ul a {
    font-size: 0.9em !important;
    padding-left: 30px !important;
    background: #6d7fcc;
}
`;