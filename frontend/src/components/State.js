import React, { Component } from 'react';
import { CachedTileLayer } from '@yaga/leaflet-cached-tile-layer';
import L from 'leaflet';
import easyButton from 'leaflet-easybutton';
import { Row, Col} from "react-bootstrap";
import styled from 'styled-components';
import MenuSidenav from "./MenuSidenav";
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

var ZOOM = 7;

export default class State extends Component {
    constructor() {
        super();
        this.removeOriginalDistrictLayer = this.removeOriginalDistrictLayer.bind(this);
        this.loadOriginalDistricts = this.loadOriginalDistricts.bind(this);
        this.loadOriginalDistrictData = this.loadOriginalDistrictData.bind(this);
        this.initializePhase1Map = this.initializePhase1Map.bind(this);

        this.state = {
            sidebar: true,
            precinctData: "",
            displayedDistrictData: "",
            originalDistrictData: "",
            generatedDistrictData: "",
            stateData: "",
            chosenState: window.location.pathname.split("/").pop(),
            precinctLayer: null,
            precinctIds: null,
            originalDistrictLayer: null,
            originalDistrictsLoaded: false,
            generatedDistrictLayer: null,
            districtIds: null,
        };

        this.toggleBox = this.toggleBox.bind(this);
    }

    removeOriginalDistrictLayer() {
        if(this.state.originalDistrictsLoaded) {
            this.map.removeLayer(this.state.originalDistrictLayer);
            this.setState({originalDistrictsLoaded: false});
            this.setState({displayedDistrictData: this.state.generatedDistrictData});
        }
    }

    loadOriginalDistrictData(districtId, that) {
        let district_data_url = 'http://127.0.0.1:8080/district/original/' + this.state.chosenState + '/' + districtId;
        return fetch(district_data_url).then(function (response) {
            if (response.status >= 400) {
                throw new Error("Failed to load original district number from server");
            }
            return response.json();
        }).then(function (data) {
            that.setState({originalDistrictData: data});
            that.setState({displayedDistrictData: data});
        });
    }

    loadDistrictNumber() {
        var that = this;
        let district_number_url = 'http://127.0.0.1:8080/district/original/' + this.state.chosenState;
        return fetch(district_number_url).then(function (response) {
            if (response.status >= 400) {
                throw new Error("Failed to load cluster data from server");
            }
            return response.json();
        }).then(function (data) {
            that.setState({districtIds: data});
            return data;
        })
    }

    async loadOriginalDistrictsIncrementally(map, districtIds, that) {
        var selected;

        function districtStyle(feature) {
            return {
                fillColor: feature.properties.COLOR,
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.7
            };
        }

        let districtUrl = 'http://127.0.0.1:8080/borders/district/' + this.state.chosenState + '/';
        let districtLayerArr = [];

        let districtPromises = districtIds.map(districtId => fetch(districtUrl + districtId).then(function (response) {
                if (response.status >= 400) {
                    throw new Error("District geographic data not incrementally loaded from server successfully");
                }
                return response.json();
            }).then(function (data) {
                let layers = L.geoJSON(data, {style: districtStyle});
                layers.eachLayer(function(layer) {
                    layer.feature.properties.districtId = districtId;
                })
                districtLayerArr.push(layers);
            }))


        await Promise.all(districtPromises).then(() => {
            let layerGroup = L.featureGroup(districtLayerArr).addTo(map);
            that.setState({originalDistrictLayer: layerGroup});
            that.setState({originalDistrictsLoaded: true});

            layerGroup.eachLayer(function (layer) {
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
                    /*if(that.state.chosenState === "RhodeIsland") {
                        districtId = event.layer.feature.properties.CD115FP;
                    }
                    else if(that.state.chosenState === "NorthCarolina") {
                        districtId = event.layer.feature.properties.CD116FP;
                    }
                    else if(that.state.chosenState === "Michigan") {
                        districtId = event.layer.feature.properties.NAME;
                    }*/
                    districtId = event.layer.feature.properties.districtId;
                    that.loadOriginalDistrictData(districtId, that);
                });
            });
        });
    }

    async loadPrecinctsIncrementally(precinctIds, that) {
        var precinctStyle = {
            "color": "black"
        };
        var precinctLayerArr = [];
        var precinctUrl = 'http://127.0.0.1:8080/borders/precinct/' + that.state.chosenState + '/';

        let precinctPromises = precinctIds.map(precinctId => fetch(precinctUrl + precinctId).then(function (response) {
            if (response.status >= 400) {
                throw new Error("Precinct geographic data not incrementally loaded from server successfully");
            }
            return response.json();
        }).then(function (data) {
            let layer = L.geoJSON(data, {style: precinctStyle});
            precinctLayerArr.push(layer);
        }))

        await Promise.all(precinctPromises).then(() => {
            let layerGroup = L.featureGroup(precinctLayerArr);
            that.setState({precinctLayer: layerGroup});
            this.map.on("zoomend", function (event) {
                if (this.getZoom() >= ZOOM && that.state.precinctLayer === null) {
                    layerGroup.addTo(that.map);
                    layerGroup.bringToFront();
                    layerGroup.eachLayer(function (layer) {
                        layer.on('mouseover', function (event) {
                            that.loadOriginalDistrictData(event.layer.feature.properties.CD, that);
                            that.setState({precinctData: JSON.stringify(event.layer.feature.properties)})
                        });
                    });

                    return true;
                }
                else {
                    if (this.getZoom() < ZOOM && that.state.precinctLayer !== null) {
                        that.state.precinctLayer.remove();
                        that.setState({precinctLayer: null});
                    }
                }
            })
        });
    }

    initializePhase1Map() {
        this.setState({generatedDistrictLayer: this.state.precinctLayer});
        this.removeOriginalDistrictLayer();
        this.state.precinctLayer.addTo(this.map);
        this.state.precinctLayer.eachLayer(function(layer) {
            layer.setStyle({fillColor: 'blue'});//layer.feature.properties.COLOR});
        });
        this.setState({displayedDistrictData: this.state.precinctData});
        this.setState({generatedDistrictData: this.state.precinctData});
    }

    loadOriginalDistricts() {
        if(!this.state.originalDistrictsLoaded) {
            this.state.originalDistrictLayer.addTo(this.map);
            this.setState({displayedDistrictData: this.state.originalDistrictData});
            this.state.originalDistrictLayer.eachLayer(function (layer) {
                layer.on('click', function (e) {
                    if (this.selected) {
                        e.target.resetStyle(this.selected)
                    }
                    this.selected = e.layer
                    this.selected.bringToFront()
                    this.selected.setStyle({
                        'color': 'red'
                    })
                    this.map.fitBounds(e.layer.getBounds());
                });

                layer.on('mouseover', function (event) {
                    let districtId = "";
                    districtId = event.layer.feature.properties.districtId;
                    this.loadOriginalDistrictData(districtId, this);
                });
            });
            this.setState({originalDistrictsLoaded: true});
        }
    }

    loadStateData() {
        var that = this;
        let state_data_url = 'http://127.0.0.1:8080/state/original/' + this.state.chosenState;
        return fetch(state_data_url).then(function (response) {
            if (response.status >= 400) {
                throw new Error("Failed to load state data from server");
            }
            return response.json();
        }).then(function (data) {
            that.setState({stateData: data});
            that.setState({precinctIds: data.precinctIds});
            return data.precinctIds;
        });
    }

    toggleBox() {
        this.setState(oldState => ({ sidebar: !oldState.sidebar }));
    }

    componentDidMount() {
        var maxBounds;
        var minZoom;
        var chosenState = window.location.pathname.split("/").pop();
        var clustersUrl;

        this.setState({ chosenState: chosenState });

        if (chosenState === "NorthCarolina") {
            clustersUrl = 'http://127.0.0.1:8080/District_Borders?name=North_Carolina';
            maxBounds = [
                [37, -71],               /* North East */
                [33, -84]                /* South West */
            ];
            minZoom = 6;
            ZOOM = minZoom + 1;
        } else if (chosenState === "RhodeIsland") {
            clustersUrl = 'http://127.0.0.1:8080/District_Borders?name=Rhode_Island';
            maxBounds = [
                [43, -70.75],
                [40, -71]
            ];
            minZoom = 9;
            ZOOM = minZoom + 1;
        } else if (chosenState === "Michigan") {
            clustersUrl = 'http://127.0.0.1:8080/District_Borders?name=Michigan';
            maxBounds = [
                [49, -70],
                [40, -90]
            ];
            minZoom = 6;
            ZOOM = minZoom + 1;
        }

        this.map = L.map('map', {
            maxZoom: 20,
            minZoom: minZoom,
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

        this.loadStateData().then(precinctIds =>
        {
            this.loadPrecinctsIncrementally(precinctIds, that);
        });

        this.loadDistrictNumber().then(districtIds =>
        {
            this.loadOriginalDistrictsIncrementally(this.map, districtIds, that)
        });
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
                        <Col className="menu" xs={5}>
                            <MenuSidenav chosenState={this.state.chosenState} precinctData={this.state.precinctData}
                                districtData={this.state.displayedDistrictData} stateData={this.state.stateData}
                                removeOriginalDisrtricts={this.removeOriginalDistrictLayer} precinctLayer={this.state.precinctLayer}
                                loadOriginalDistricts={this.loadOriginalDistricts} initializePhase1Map={this.initializePhase1Map}/>
                        </Col>
                        <Col className="mapContainer" xs={7}>
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
