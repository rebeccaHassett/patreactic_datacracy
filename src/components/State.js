import React, {Component} from 'react';
import L from 'leaflet';
import {Container, Button, Tabs, Tab, Row, Col, Accordion, Image} from "react-bootstrap";
import styled from 'styled-components';
import Precinct from "./Precinct";
import Cluster from "./Cluster";
import Menu_Sidenav from "./Menu_Sidenav";
import Results_Sidenav from './Results_Sidenav';

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
            Sidebar: true,
            even: true
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
        var precincts_displayed = false;
        var chosen_state = window.location.pathname.split("/").pop();

        console.log(chosen_state);

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
                L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
                    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
                })
            ]
        }).fitBounds(max_bounds);


        this.map.on("zoomend", function (event) {
            if (this.getZoom() >= 7) {
                const precincts = new Precinct();
                precincts_displayed = true;
                if(chosen_state === "RhodeIsland") {
                    precincts.addPrecinctsToDistricts('http://127.0.0.1:8080/precinct_geographical%20data/Rhode_Island/Voting_Precincts.geojson', this);
                }
                else if(chosen_state === "NorthCarolina") {
                    precincts.addPrecinctsToDistricts('http://127.0.0.1:8080/precinct_geographical%20data/North_Carolina/nc_precincts.json', this);
                }
                else {
                    precincts.addPrecinctsToDistricts('http://127.0.0.1:8080/precinct_geographical%20data/Michigan/2016_Voting_Precincts.geojson', this);
                }
                console.log("LOAD PRECINCTS");
            }
        });

        var that = this;
        const clusters = new Cluster();
        clusters.addClustersToState(clusters_url, this.map)
            .then(cluster_layer => clusters.addClustersToState(clusters_url, this.map))
            .then(cluster_layer =>
                {console.log(cluster_layer);
                    cluster_layer.on('mouseover', function(event) {
                        console.log(event);
                        if(parseInt(event.layer.feature.properties.NAME,10) % 2 === 0 || parseInt(event.layer.feature.properties.CD116FP,10) % 2 === 0 || parseInt(event.layer.feature.properties.CD115FP,10) % 2 === 0) {
                            that.setState({even:true});
                        }
                        else {
                            that.setState({even:false});
                        }
                    });
                return true;})
            .catch(err => console.log(err));

    }

    render() {
        return (
            <State_Style>
                <Row>
                    <Menu_Sidenav side="left"></Menu_Sidenav>
                    <Col>
                        <Container>
                            <body>
                            <div id='map'></div>
                            </body>
                        </Container>
                    </Col>
                    <Results_Sidenav sign={this.state.even}></Results_Sidenav>
                </Row>
            </State_Style>
        );
    }
}

const State_Style = styled.div`
    overflow:hidden;
    #map {
      height: 600px;
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