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
            sidebar: true,
            precinctData: "",
            districtData: "",
            stateData: "",
            chosenState: window.location.pathname.split("/").pop()
        }

        this.toggleBox = this.toggleBox.bind(this);
    }

    toggleBox() {
        this.setState(oldState => ({sidebar: !oldState.sidebar}));
    }

    componentDidMount() {
        var maxBounds;
        var minZoom;
        var clustersUrl;
        var chosenState = window.location.pathname.split("/").pop();

        if (chosenState === "NorthCarolina") {
            clustersUrl = 'http://127.0.0.1:8080/District_Borders?name=North_Carolina';

            maxBounds = [
                [37, -71],               /* North East */
                [33, -86]                /* South West */
            ];
            minZoom = 6;
        } else if (chosenState === "RhodeIsland") {
            clustersUrl = 'http://127.0.0.1:8080/District_Borders?name=Rhode_Island';
            maxBounds = [
                [43, -70.75],
                [40, -72]
            ];
            minZoom = 9;
        } else if (chosenState === "Michigan") {
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
            preferCanvas: true,
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
                if (chosenState === "RhodeIsland") {
                    precinctsUrl = 'http://127.0.0.1:8080/Precinct_Borders?name=Rhode_Island'
                } else if (chosenState === "NorthCarolina") {
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
                    <Col>
                        <MenuSidenav side="left" id="menu" state={this.state.chosenState}></MenuSidenav>
                    </Col>
                    <Col>
                        <Container>
                            <body>
                            <div id='map'></div>
                            </body>
                        </Container>
                    </Col>
                    <Col>
                        <ResultsSidenav precinctData={this.state.precinctData} districtData={this.state.districtData}
                                        stateData={this.state.stateData}
                                        chosenState={this.state.chosenState}></ResultsSidenav>
                    </Col>
                </Row>
            </State_Style>
        );
    }
}

const State_Style = styled.div`
    overflow: hidden;
    #map {
      height: 47.5vw;
      width: 100vw;
    }
`;