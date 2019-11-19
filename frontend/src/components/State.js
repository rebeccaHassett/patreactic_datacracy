import React, {Component} from 'react';
import L from 'leaflet';
import {Container, Row, Col} from "react-bootstrap";
import styled from 'styled-components';
import Precinct from "./Precinct";
import Cluster from "./Cluster";
import MenuSidenav from "./MenuSidenav";
import ResultsSidenav from './ResultsSidenav';

export default class State extends Component {
    constructor() {
        super();
        this.state = {
            Sidebar: true,
            precinctData: ""
        }

        this.toggleBox = this.toggleBox.bind(this);
    }

    toggleBox() {
        this.setState(oldState => ({Sidebar: !oldState.Sidebar}));
    }

    componentDidMount() {
        var maxBounds;
        var minZoom;
        var clustersUrl;
        var chosen_state = window.location.pathname.split("/").pop();

        console.log(chosen_state);

        if (chosen_state === "NorthCarolina") {
            clustersUrl = 'http://127.0.0.1:8080/District_Borders?name=North_Carolina';

            maxBounds = [
                [37, -71],               /* North East */
                [33, -86]                /* South West */
            ];
            minZoom = 6;
        } else if (chosen_state === "RhodeIsland") {
            clustersUrl = 'http://127.0.0.1:8080/District_Borders?name=Rhode_Island';
            maxBounds = [
                [43, -70.75],
                [40, -72]
            ];
            minZoom = 9;
        } else if(chosen_state === "Michigan"){
            clustersUrl = 'http://127.0.0.1:8080/District_Borders?name=Michigan';
            maxBounds = [
                [49, -75],
                [40, -93]
            ];
            minZoom = 6;

        }

        this.map = L.map('map', {
            maxZoom: 20,
            minZoom: minZoom,
            maxBounds: maxBounds,
            maxBoundsViscosity: 1.0,
            layers: [
                L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
                    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
                })
            ]
        }).fitBounds(maxBounds);

        var that = this;
        this.map.on("zoomend", function (event) {
            if (this.getZoom() >= 7) {
                var precinctsUrl;
                const precincts = new Precinct();
                if (chosen_state === "RhodeIsland") {
                    precinctsUrl = 'http://127.0.0.1:8080/Precinct_Borders?name=Rhode_Island'
                } else if (chosen_state === "NorthCarolina") {
                    precinctsUrl = 'http://127.0.0.1:8080/Precinct_Borders?name=North_Carolina'
                } else {
                    precinctsUrl = 'http://127.0.0.1:8080/Precinct_Borders?name=Michigan'
                }

                precincts.addPrecinctsToDistricts(precinctsUrl, this)
                    .then(precinct_layer => precincts.addPrecinctsToDistricts(precinctsUrl, this))
                    .then(precinct_layer => {
                        precinct_layer.on('mouseover', function (event) {
                            that.setState({precinctData: JSON.stringify(event.layer.feature.properties)})
                        });
                        return true;
                    })
                    .catch(err => console.log(err));
            }
        })

        const clusters = new Cluster();
        clusters.addClustersToState(clustersUrl, this.map);
    }

    render() {
        return (
            <State_Style>
                <Row>
                    <MenuSidenav side="left" id="menu"></MenuSidenav>
                    <Col>
                        <Container>
                            <body>
                            <div id='map'></div>
                            </body>
                        </Container>
                    </Col>
                    <ResultsSidenav precinctData={this.state.precinctData}></ResultsSidenav>
                </Row>
            </State_Style>
        );
    }
}

const State_Style = styled.div`
    overflow: hidden
    #map {
      height: 600px;
    }
`;