import React, { Component } from 'react';
import L from 'leaflet';
import { Row, Col, Card } from "react-bootstrap";
import styled from 'styled-components';
import Precinct from "./Precinct";
import Cluster from "./Cluster";
import MenuSidenav from "./MenuSidenav";
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Box from "@material-ui/core/Box";

var ZOOM = 7;

export default class State extends Component {
    constructor() {
        super();
        this.handleOriginalDistrictLayer = this.handleOriginalDistrictLayer.bind(this);
        this.removeOriginalDistrictLayer = this.removeOriginalDistrictLayer.bind(this);
        this.addPrecinctsToDistricts = this.addPrecinctsToDistricts.bind(this);
        this.handlePrecinctExists = this.handlePrecinctExists.bind(this);

        this.state = {
            sidebar: true,
            precinctData: "",
            districtData: "",
            stateData: "",
            chosenState: window.location.pathname.split("/").pop(),
            originalDistrictLayer: null,
            precinctLayerExists: false,
            precinctLayer: null,
        }

        this.toggleBox = this.toggleBox.bind(this);
    }

    removeOriginalDistrictLayer() {
        this.map.removeLayer(this.state.originalDistrictLayer);
    }

    handleOriginalDistrictLayer(layer) {
        this.setState({originalDistrictLayer:layer});
    }

    handlePrecinctExists() {
        this.setState({precinctLayerExists: false});
    }

    addPrecinctsToDistricts(url, map, that) {
        var layer;
        var ZOOM = 7;

        var district_style = {
            "color": "black"
        };
        return fetch(url).then(function (response) {
            if (response.status >= 400) {
                throw new Error("Precinct geographic data not loaded from server successfully");
            }
            return response.json();
        }).then(function (data) {
            /*layer = new L.GeoJSON(data, {
                style: district_style, filter: function (feature, layer) {
                    return (feature.properties.PRENAME === "PROVIDENCE 0731")
                }
            }).addTo(map);*/

            layer = L.geoJSON(data, {style: district_style}).addTo(map);

            that.setState({precinctLayer: layer});

            map.on("zoomend", function (event) {
                if (this.getZoom() < ZOOM) {
                    layer.remove();
                    that.handlePrecinctExists();
                }
            });

            layer.bringToFront();
            return layer
        });
    }

    toggleBox() {
        this.setState(oldState => ({ sidebar: !oldState.sidebar }));
    }

    componentDidMount() {
        var maxBounds;
        var minZoom;
        var clustersUrl;
        var chosenState = window.location.pathname.split("/").pop();

        this.setState({ chosenState: chosenState });

        if (chosenState === "NorthCarolina") {
            clustersUrl = 'http://127.0.0.1:8080/District_Borders?name=North_Carolina';

            maxBounds = [
                [37, -71],               /* North East */
                [33, -84]                /* South West */
            ];
            minZoom = 6;
        } else if (chosenState === "RhodeIsland") {
            clustersUrl = 'http://127.0.0.1:8080/District_Borders?name=Rhode_Island';
            maxBounds = [
                [43, -70.75],
                [40, -71]
            ];
            minZoom = 9;
        } else if (chosenState === "Michigan") {
            clustersUrl = 'http://127.0.0.1:8080/District_Borders?name=Michigan';
            maxBounds = [
                [49, -70],
                [40, -90]
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
            if (this.getZoom() >= ZOOM && that.state.precinctLayerExists === false) {
                var precinctsUrl;
                if (chosenState === "RhodeIsland") {
                    precinctsUrl = 'http://127.0.0.1:8080/Precinct_Borders?name=Rhode_Island'
                } else if (chosenState === "NorthCarolina") {
                    precinctsUrl = 'http://127.0.0.1:8080/Precinct_Borders?name=North_Carolina'
                } else {
                    precinctsUrl = 'http://127.0.0.1:8080/Precinct_Borders?name=Michigan'
                }

                that.setState({precinctLayerExists: true});

                that.addPrecinctsToDistricts(precinctsUrl, this, that)
                    .then(precinct_layer => that.addPrecinctsToDistricts(precinctsUrl, this, that))
                    .then(precinct_layer => {
                        precinct_layer.on('mouseover', function (event) {
                            that.setState({ precinctData: JSON.stringify(event.layer.feature.properties) })
                        });
                        return true;
                    })
                    .catch(err => console.log(err));
                that.setState({precinctLayerExists : true});
            }
        })

        const clusters = new Cluster();
        clusters.addOriginalDistrictsToState(clustersUrl, this.map, this.handleOriginalDistrictLayer);
    }

    render() {

        const theme = createMuiTheme({
            palette: {
                primary: {
                    main: '#1E90FF'
                }
            }
        },
        )
        return (
            <MuiThemeProvider theme={theme}>
                <State_Style>
                    <Row>
                        <Col className="menu" xs={4}>
                            <MenuSidenav chosenState={this.state.chosenState} precinctData={this.state.precinctData}
                                districtData={this.state.districtData} stateData={this.state.stateData} 
                                removeOGDisrtricts={this.removeOriginalDistrictLayer} precinctLayer={this.state.precinctLayer}/>
                        </Col>
                        <Col className="mapContainer" xs={8}>
                            <div id='map'></div>
                        </Col>
                    </Row>
                </State_Style>
            </MuiThemeProvider>
        );
    }
}

const State_Style = styled.div`
    Col {
        margin-left: 0vw;
        margin-right: 0vw;
        padding-left: 0vw;
        padding-right: 0vw;
        height: 100vh;
    }
    overflow: hidden;
    #map {
      height: 100vh;
      position: relative;
    }
    .menu {
        margin-right: 0vw;
        padding-left: 1vw;
        padding-right: 0vw;
        height: 100vh;
    }
    .mapContainer {
        margin-left: 0vw;
        padding-left: 0vw;
        height: 100vh;
    }
    #results_box {
        position: relative;
        bottom: 20vw;
        width: 20vw;
        height: 20vw;
        z-index: 299vw;
    }
`;
