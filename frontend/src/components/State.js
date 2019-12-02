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

        this.state = {
            sidebar: true,
            precinctData: "",
            districtData: "",
            stateData: "",
            chosenState: window.location.pathname.split("/").pop(),
            precinctLayer: null,
            precinctIds: null,
            individualPrecinctLayers: [],
            originalDistrictLayer: null,
            districtIds: null,
            individualDistrictLayers: []
        }

        this.toggleBox = this.toggleBox.bind(this);
    }

    removeOriginalDistrictLayer() {
        this.map.remove(this.state.originalDistrictLayer);
    }

    loadOriginalDistrictData(districtId, that) {
        let district_data_url = 'http://127.0.0.1:8080/district/original/' + this.state.chosenState + '/' + districtId;
        return fetch(district_data_url).then(function (response) {
            if (response.status >= 400) {
                throw new Error("Failed to load original district number from server");
            }
            return response.json();
        }).then(function (data) {
            that.setState({districtData: data});
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
            console.log(data);
            that.setState({districtIds: data});
        })
    }



    async loadDistrictsIncrementally(map, that) {
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

        let districtPromises = this.state.districtIds.map(districtId => fetch(districtUrl + districtId).then(function (response) {
                if (response.status >= 400) {
                    throw new Error("District geographic data not incrementally loaded from server successfully");
                }
                return response.json();
            }).then(function (data) {
                console.log(data);
                let layers = L.geoJSON(data, {style: districtStyle});
                layers.eachLayer(function(layer) {
                    console.log(layer);
                    layer.feature.properties.districtId = districtId;
                })
                districtLayerArr.push(layers);
            }))


        await Promise.all(districtPromises).then(() => {
            that.setState({individualDistrictLayers: districtLayerArr});
            let layerGroup = L.featureGroup(districtLayerArr).addTo(map);
            console.log(districtLayerArr);
            that.setState({originalDistrictLayer: layerGroup});

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

    async loadPrecinctsIncrementally(that) {
        var precinctStyle = {
            "color": "black"
        };
        var precinctLayerArr = [];
        var precinctUrl = 'http://127.0.0.1:8080/borders/precinct/' + that.state.chosenState + '/';

        let precinctPromises = this.state.precinctIds.map(precinctId => fetch(precinctUrl + precinctId).then(function (response) {
            if (response.status >= 400) {
                throw new Error("Precinct geographic data not incrementally loaded from server successfully");
            }
            return response.json();
        }).then(function (data) {
            let layer = L.geoJSON(data, {style: precinctStyle});
            precinctLayerArr.push(layer);
        }))

        await Promise.all(precinctPromises).then(() => {
            this.map.on("zoomend", function (event) {
                if (this.getZoom() >= ZOOM && that.state.precinctLayer === null) {
                    console.log(this.getZoom());
                    that.setState({individualPrecinctLayers: precinctLayerArr});
                    let layerGroup = L.featureGroup(precinctLayerArr).addTo(that.map);
                    that.setState({precinctLayer: layerGroup});
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
                    console.log(that.map.getZoom());
                    if (this.getZoom() < ZOOM && that.state.precinctLayer !== null) {
                        console.log(that.state.precinctLayer);
                        that.state.precinctLayer.remove();
                        that.setState({precinctLayer: null});
                    }
                }
            })
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
                that.loadOriginalDistrictData(districtId, that);
            });

            that.setState({originalDistrictLayer: layer});
            return layer;
        });
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

        this.loadDistrictNumber().then(data =>
        {
            this.loadDistrictsIncrementally(this.map, that)
        });

        this.loadStateData().then(data =>
        {
            this.loadPrecinctsIncrementally(that);
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
