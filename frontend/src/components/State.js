import React, { Component } from 'react';
import { CachedTileLayer } from '@yaga/leaflet-cached-tile-layer';
import L from 'leaflet';
import easyButton from 'leaflet-easybutton';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { Row, Col} from "react-bootstrap";
import styled from 'styled-components';
import MenuSidenav from "./MenuSidenav";
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

var ZOOM = 7;

export default class State extends Component {
    constructor() {
        super();
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

    handlePrecinctExists() {
        this.setState({ precinctLayerExists: false });
    }

    loadOriginalDistrictData(districtId) {
        let district_data_url = 'http://127.0.0.1:8080/district/original/' + this.state.chosenState + '/' + districtId;
        return fetch(district_data_url).then(function (response) {
            if (response.status >= 400) {
                throw new Error("Failed to load original district number from server");
            }
            return response.json();
        }).then(function (data) {
            console.log(data);
            this.setState({districtData: data});
        });
    }

    addOriginalDistrictsToState(url, map, that) {
        var layer;
        var selected;

        function cluster_style(feature) {
            return {
                fillColor: feature.properties.COLOR,
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.7
            };
        }

        return fetch(url).then(function (response) {
            if (response.status >= 400) {
                throw new Error("Failed to load cluster data from server");
            }
            return response.json();
        }).then(function (data) {
            layer = L.geoJSON(data, {style: cluster_style}).addTo(map);

            layer.on('click', function (e) {
                if (selected) {
                    e.target.resetStyle(selected)
                }
                selected = e.layer
                selected.bringToFront()
                selected.setStyle({
                    'color': 'red'
                })
                map.fitBounds(e.layer.getBounds());
            });

            layer.on('mouseover', function (event) {
                let districtId = "";
                if(that.state.chosenState === "RhodeIsland") {
                    districtId = event.layer.feature.properties.CD115FP;
                }
                else if(that.state.chosenState === "NorthCarolina") {
                    districtId = event.layer.feature.properties.CD116FP;
                }
                else if(that.state.chosenState === "Michigan") {
                    districtId = event.layer.feature.properties.NAME;
                }
                that.loadOriginalDistrictData(districtId);
            });

            that.setState({originalDistrictLayer: layer});
            return layer;
        });
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
            layer = L.geoJSON(data, { style: district_style }).addTo(map);

            that.setState({ precinctLayer: layer });

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
            //maxBounds: maxBounds,
            maxBoundsViscosity: 1.0,
            preferCanvas: true,
            layers: [
                new CachedTileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
                    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
                }),
            ]
        }).fitBounds(maxBounds);

        L.easyButton('<h5>Back US to Map</h5>', function() {
            window.location.replace("/map");
        },  {position: 'topright'}).addTo(this.map);

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

                that.setState({ precinctLayerExists: true });

                that.addPrecinctsToDistricts(precinctsUrl, this, that)
                    .then(precinct_layer => {
                        precinct_layer.on('mouseover', function (event) {
                            that.setState({ precinctData: JSON.stringify(event.layer.feature.properties) })
                        });
                        return true;
                    })
                    .catch(err => console.log(err));
                that.setState({ precinctLayerExists: true });
            }
        })

        this.addOriginalDistrictsToState(clustersUrl, this.map, that);
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
                                removeOGDisrtricts={this.removeOriginalDistrictLayer} precinctLayer={this.state.precinctLayer} />
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
