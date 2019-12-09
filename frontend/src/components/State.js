import React, { Component } from 'react';
import { CachedTileLayer } from '@yaga/leaflet-cached-tile-layer';
import L from 'leaflet';
import easyButton from 'leaflet-easybutton';
import { Row, Col} from "react-bootstrap";
import styled from 'styled-components';
import MenuSidenav from "./MenuSidenav";
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import 'colorsys';

var ZOOM = 7;

export default class State extends Component {
    constructor() {
        super();
        this.removeOriginalDistrictLayer = this.removeOriginalDistrictLayer.bind(this);
        this.loadOriginalDistricts = this.loadOriginalDistricts.bind(this);
        this.loadOriginalDistrictData = this.loadOriginalDistrictData.bind(this);
        this.phase0SelectedElection = this.phase0SelectedElection.bind(this);
        this.initializePhase1Map = this.initializePhase1Map.bind(this);
        this.phase1Update = this.phase1Update.bind(this);
        this.demographicMapUpdate = this.demographicMapUpdate.bind(this);
        this.demographicMapUpdateSelection = this.demographicMapUpdateSelection.bind(this);
        this.addDistrictsToMap = this.addDistrictsToMap.bind(this);
        this.addPrecinctsToMap = this.addPrecinctsToMap.bind(this);

        this.state = {
            sidebar: true,
            precinctData: "",
            districtData: "",
            stateData: "",
            election: "Presidential 2016",
            chosenState: window.location.pathname.split("/").pop(),
            precinctsLoaded: false,
            precinctMap: {},
            originalDistrictLayer: null,
            originalDistrictsLoaded: false,
            originalDistrictDataMap: {},
            generatedDistrictMap: {},
            districtIds: null,
            generatedDistrictDataMap: {},
            demographicsMapDisplay: []
        };
        this.toggleBox = this.toggleBox.bind(this);
    }

    phase0SelectedElection(selectedElection) {
        this.setState({election: selectedElection});
        let precinctArr = [];
        let that = this;
        Object.keys(this.state.precinctMap).forEach(function (key) {
            precinctArr.push(that.state.precinctMap[key]);
        });
        let layerGroup = L.layerGroup(precinctArr);
        layerGroup.eachLayer(function (layer) {
            let precinctLayers = layer._layers;
            let republicanElectionData;
            let democraticElectionData;
            Object.keys(precinctLayers).forEach(function (key) {
                if (selectedElection === "Presidential 2016") {
                    republicanElectionData = precinctLayers[key].feature.properties.PRES16R;
                    democraticElectionData = precinctLayers[key].feature.properties.PRES16D;
                } else if (selectedElection.split(" ")[0] === "Congressional") {
                    let houseElection;
                    if (selectedElection.split(" ")[1] === "2016") {
                        houseElection = precinctLayers[key].feature.properties.HOUSE_ELECTION_16;
                    } else if (selectedElection.split(" ")[1] === "2018") {
                        houseElection = precinctLayers[key].feature.properties.HOUSE_ELECTION_18;
                    }
                    for (var candidate in houseElection) {
                        if (candidate.endsWith("_D")) {
                            democraticElectionData = houseElection[candidate];
                        } else if (candidate.endsWith("_R")) {
                            republicanElectionData = houseElection[candidate];
                        }
                    }
                }
                precinctLayers[key].setStyle({
                    fillColor: that.getVotingColors(republicanElectionData, democraticElectionData),
                    opacity: 1,
                    fillOpacity: 0.8,
                    weight: 2,
                    color: 'white',
                });
            });
        });
    }

    removeOriginalDistrictLayer() {
        if(this.state.originalDistrictsLoaded) {
            this.map.removeLayer(this.state.originalDistrictLayer);
            this.setState({originalDistrictsLoaded: false});
            let generatedDistrictsArr = [];
            let that = this;
            Object.keys(this.state.generatedDistrictMap).forEach(function(key) {
                generatedDistrictsArr.push(that.state.generatedDistrictMap[key]);
            });
            let layerGroup = L.featureGroup(generatedDistrictsArr);
            that.addDistrictsToMap(layerGroup, false, that.state.generatedDistrictDataMap);
        }
    }

    loadOriginalDistrictData(districtId, that) {
        let instance = that;
        let district_data_url = 'http://127.0.0.1:8080/district/original/' + this.state.chosenState + '/' + districtId;
        return fetch(district_data_url).then(function (response) {
            if (response.status >= 400) {
                throw new Error("Failed to load original district number from server");
            }
            return response.json();
        }).then(function (data) {
            let tempDataMap = instance.state.originalDistrictDataMap;
            tempDataMap[districtId] = data;
            instance.setState({originalDistrictDataMap: tempDataMap});
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
        let districtUrl = 'http://127.0.0.1:8080/borders/district/' + this.state.chosenState + '/';
        let districtLayerArr = [];

        let districtPromises = districtIds.map(districtId => fetch(districtUrl + districtId).then(function (response) {
                if (response.status >= 400) {
                    throw new Error("District geographic data not incrementally loaded from server successfully");
                }
                return response.json();
            }).then(function (data) {
                let layers = L.geoJSON(data);
                layers.eachLayer(function(layer) {
                    layer.feature.properties.districtId = districtId;
                });
                districtLayerArr.push(layers);
            }));


        await Promise.all(districtPromises).then(() => {
            let layerGroup = L.featureGroup(districtLayerArr);
            that.setState({originalDistrictLayer: layerGroup});
            that.setState({originalDistrictsLoaded: true});

            this.addDistrictsToMap(layerGroup, true, {});
         });

        districtIds.map(districtId => {
            that.loadOriginalDistrictData(districtId, that);
        });
    }

    async loadPrecinctsIncrementally(precinctIds, that) {
        var precinctStyle = {
            "color": "black"
        };
        var precinctLayerArr = [];
        var precinctUrl = 'http://127.0.0.1:8080/borders/precinct/' + that.state.chosenState + '/';
        let precinctMap = {};

        let precinctPromises = precinctIds.map(precinctId => fetch(precinctUrl + precinctId).then(function (response) {
            if (response.status >= 400) {
                throw new Error("Precinct geographic data not incrementally loaded from server successfully");
            }
            return response.json();
        }).then(function (data) {
            let layer = L.geoJSON(data, {style: precinctStyle});
            precinctLayerArr.push(layer);
            precinctMap[precinctId] = layer;
        }));

        await Promise.all(precinctPromises).then(() => {
            this.setState({precinctMap: precinctMap});
            let layerGroup = L.featureGroup(precinctLayerArr);
            this.addPrecinctsToMap(layerGroup, this.map, that);
        });
    }

    contrastingColors(total)
    {
        var colorsys = require('colorsys');

        var i = 360 / (total - 1); // distribute the colors evenly on the hue range
        var r = []; // hold the generated colors
        //s = 80, v = 70 is brighter
        for (var x=0; x<total; x++)
        {
            r.push(colorsys.hsvToRgb(i * x, 50, 50)); // you can also alternate the saturation and value for even more contrast between the colors
        }
        return r;
    }

    initializePhase1Map(data) {
        var colorsys = require('colorsys');
        let contrastingColors = this.contrastingColors(Object.keys(this.state.precinctMap).length);
        this.map.removeLayer(this.state.originalDistrictLayer);
        let updatedDistrictMap = this.state.precinctMap;
        let districtDataMap = {};
        console.log(data);
        data.districtUpdates.forEach((updatedDistrict, index) => {
            let updatedDistrictId = updatedDistrict.PRENAME;
            updatedDistrict.precinctIds.forEach(precinctId => {
                let updatedDistrictLayers = updatedDistrictMap[precinctId]._layers;
                Object.keys(updatedDistrictLayers).forEach(function(key) {
                    updatedDistrictLayers[key].feature.properties.districtId = updatedDistrictId;
                    updatedDistrictLayers[key].feature.properties.COLOR = colorsys.rgb2Hex(contrastingColors[index]);
                });
            });

            /*Initialize Generated District Data Map*/
            districtDataMap[updatedDistrictId] = {"VAP" : updatedDistrict.VAP, "HVAP" : updatedDistrict.HVAP, "WVAP" : updatedDistrict.WVAP,
                                            "BVAP" : updatedDistrict.BVAP, "AMINVAP" : updatedDistrict.AMINVAP, "ASIANVAP" : updatedDistrict.ASIANVAP,
                                            "PRES16D" : updatedDistrict.PRES16D, "PRES16R" : updatedDistrict.PRES16R, "PRENAME" : updatedDistrict.PRENAME,
                                            "HOUSE_ELECTION_16" : updatedDistrict.HOUSE_ELECTION_16, "HOUSE_ELECTION_18" : updatedDistrict.HOUSE_ELECTION_18};

        });
        this.setState({generatedDistrictMap: updatedDistrictMap});
        this.setState({generatedDistrictDataMap : districtDataMap});
        let generatedDistrictsArr = [];
        Object.keys(updatedDistrictMap).forEach(function(key) {
            generatedDistrictsArr.push(updatedDistrictMap[key]);
        });
        let layerGroup = L.featureGroup(generatedDistrictsArr);
        this.addDistrictsToMap(layerGroup, false, districtDataMap);
        this.setState({originalDistrictsLoaded: false});
    }


    phase1Update(data) {
        if(this.state.originalDistrictsLoaded) {
            this.map.removeLayer(this.state.originalDistrictLayer);
        }
        let updatedDistrictMap = this.state.generatedDistrictMap;
        data.districtUpdates.forEach((updatedDistrict) => {
            let updatedDistrictId = updatedDistrict.PRENAME;
            let mergedIntoPrecinctIds = data.precinctIds.filter(x => !data.districtsToRemove.includes(x));
            let updateColor = updatedDistrictMap[mergedIntoPrecinctIds[0]].feature.properties.COLOR;
            updatedDistrict.precinctIds.forEach(precinctId => {
                updatedDistrictMap[precinctId].feature.properties.districtId = updatedDistrictId;
                updatedDistrictMap[precinctId].feature.properties.COLOR = updateColor;
            });

            /*Initialize Generated District Data Map*/
            districtDataMap[updatedDistrictId] = {"VAP" : updatedDistrict.VAP, "HVAP" : updatedDistrict.HVAP, "WVAP" : updatedDistrict.WVAP,
                "BVAP" : updatedDistrict.BVAP, "AMINVAP" : updatedDistrict.AMINVAP, "ASIANVAP" : updatedDistrict.ASIANVAP,
                "PRES16D" : updatedDistrict.PRES16D, "PRES16R" : updatedDistrict.PRES16R, "PRENAME" : updatedDistrict.PRENAME,
                "HOUSE_ELECTION_16" : updatedDistrict.HOUSE_ELECTION_16, "HOUSE_ELECTION_18" : updatedDistrict.HOUSE_ELECTION_18};

        });
        let districtDataMap = this.state.generatedDistrictDataMap;
        data.districtsToRemove.forEach(removeDistrict => {
            districtDataMap.delete(removeDistrict);
        });
        this.setState({generatedDistrictMap: updatedDistrictMap});
        this.setState({generatedDistrictDataMap : districtDataMap});
        let generatedDistrictsArr = [];
        Object.keys(updatedDistrictMap).forEach(function(key) {
            generatedDistrictsArr.push(updatedDistrictMap[key]);
        });
        let layerGroup = L.featureGroup(generatedDistrictsArr);
        this.addDistrictsToMap(layerGroup, false, districtDataMap);
        this.setState({originalDistrictsLoaded: false});
    }

    loadOriginalDistricts() {
        let that = this;
        if(!this.state.originalDistrictsLoaded) {
            let districtArr = [];
            Object.keys(this.state.generatedDistrictMap).forEach(function(key) {
                districtArr.push(that.state.generatedDistrictMap[key]);
            });
            districtArr.forEach(layer => {
               this.map.removeLayer(layer);
            });
            this.setState({originalDistrictsLoaded: true});
            this.addDistrictsToMap(this.state.originalDistrictLayer, true, {});
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

    addDistrictsToMap(districtLayer, original, districtDataMap) {
        districtLayer.addTo(this.map);
        let that = this;
        districtLayer.eachLayer(function (layer) {
            layer.on('click', function (e) {
                if (this.selected) {
                    e.target.resetStyle(this.selected)
                }
                this.selected = e.layer
                this.selected.bringToFront();
                this.selected.setStyle({
                    'color': 'red'
                });
                this.map.fitBounds(e.layer.getBounds());
            });

            layer.on('mouseover', function (event) {
                let districtId = "";
                districtId = event.layer.feature.properties.districtId;
                if(original) {
                    that.setState({districtData: that.state.originalDistrictDataMap[districtId]});
                }
                else {
                    that.setState({districtData: districtDataMap[districtId]});
                }
            });
            /*If no color field, then original districts and set color based on votes, else set color based on properties field*/
            let districtLayers = layer._layers;
            Object.keys(districtLayers).forEach(function(key) {
                districtLayers[key].setStyle( {
                    fillColor: districtLayers[key].feature.properties.COLOR,
                    weight: 2,
                    color: 'white',
                    opacity: 1,
                    fillOpacity: 0.7
                });
            });
        });

        }

        getVotingColors(r, d) {
        if(r > d) {
            console.log(r/(r+d) * 100);
            return (r/(r+d) * 100) > 90 ? '#67000d' :
                (r/(r+d) * 100) > 80 ? '#a50f15' :
                    (r/(r+d) * 100) > 70 ? '#cb181d' :
                        (r/(r+d) * 100) > 60 ? '#ef3b2c' :
                                        '#fb6a4a';
        }
        else {
            console.log(d/(r+d) *100);
            return (d /(r+d)* 100) > 90? '#084594' :
                (d /(r+d)* 100) > 80 ? '#2171b5' :
                    (d /(r+d)* 100) > 70 ? '#4292c6' :
                        (d /(r+d)* 100) > 60 ? '#6baed6' :
                                        '#9ecae1';
        }
        }

        addPrecinctsToMap(layerGroup, map, that) {
            map.on("zoomend", function (event) {
                if (this.getZoom() >= ZOOM  && !that.state.precinctsLoaded) {
                    that.removeOriginalDistrictLayer();
                    layerGroup.addTo(map);
                    that.setState({precinctsLoaded: true});
                    layerGroup.bringToFront();
                    layerGroup.eachLayer(function (layer) {
                        let precinctLayers = layer._layers;
                        let republicanElectionData;
                        let democraticElectionData;
                        Object.keys(precinctLayers).forEach(function(key) {
                            if(that.state.election === "Presidential 2016") {
                                republicanElectionData = precinctLayers[key].feature.properties.PRES16R;
                                democraticElectionData = precinctLayers[key].feature.properties.PRES16D;
                            }
                            else if(that.state.election.split(" ")[0] === "Congressional") {
                                let houseElection;
                                if(that.state.election.split(" ")[1] === "2016") {
                                    houseElection = precinctLayers[key].feature.properties.HOUSE_ELECTION_16;
                                }
                                else if(that.state.election.split(" ")[1] === "2018") {
                                    houseElection = precinctLayers[key].feature.properties.HOUSE_ELECTION_18;
                                }
                                for(var candidate in houseElection) {
                                    if(candidate.endsWith("_D")) {
                                        democraticElectionData = houseElection[candidate];
                                    }
                                    else if(candidate.endsWith("_R")) {
                                        republicanElectionData = houseElection[candidate];
                                    }
                                }
                            }
                            precinctLayers[key].setStyle( {
                                fillColor: that.getVotingColors(republicanElectionData, democraticElectionData),
                                opacity: 1,
                                fillOpacity: 0.8,
                                weight: 2,
                                color: 'white',
                            });
                        });
                        layer.on('mouseover', function (event) {
                            /*CD property is original congressional district that precinct is in, districtId is the assigned district*/
                            that.setState({districtData: that.state.originalDistrictDataMap[event.layer.feature.properties.CD]});
                            that.setState({precinctData: JSON.stringify(event.layer.feature.properties)})
                        });
                    });
                    return true;
                }
                else {
                    if (this.getZoom() < ZOOM && that.state.precinctsLoaded) {
                        let precinctArr = [];
                        Object.keys(that.state.precinctMap).forEach(function(key) {
                            precinctArr.push(that.state.precinctMap[key]);
                        });
                        precinctArr.forEach(layer => {
                            that.map.removeLayer(layerGroup)
                        });
                        that.setState({precinctsLoaded: false});
                        that.loadOriginalDistricts();
                    }
                }
            })
        }

    /*Updates Population Distribution in Map*/
    demographicMapUpdate() {
        console.log(this.state.demographicsMapDisplay);
        let that = this;
        if(this.state.precinctsLoaded) {
            let precinctArr = [];
            Object.keys(that.state.precinctMap).forEach(function(key) {
                precinctArr.push(that.state.precinctMap[key]);
            });
            precinctArr.forEach(layer => {
                that.map.removeLayer(layer)
            });
            that.setState({precinctsLoaded: false});
        }
        if(!this.state.originalDistrictsLoaded) {
            this.addDistrictsToMap(this.state.originalDistrictLayer, true, {});
        }
        this.state.originalDistrictLayer.eachLayer(function (layer) {
            let districtLayers = layer._layers;
            console.log(layer);
            Object.keys(districtLayers).forEach(function(key) {
                let combinedPopulation = 0;
                let districtData = that.state.originalDistrictDataMap[districtLayers[key].feature.properties.districtId];
                that.state.demographicsMapDisplay.forEach(demographic => {
                   if(demographic === "WHITE") {
                       combinedPopulation = combinedPopulation + districtData.WVAP;
                   }
                   else if(demographic === "BLACK") {
                       combinedPopulation = combinedPopulation + districtData.BVAP;
                   }
                   else if(demographic === "ASIAN") {
                       combinedPopulation = combinedPopulation + districtData.ASIANVAP;
                   }
                   else if(demographic === "HISPANIC") {
                       combinedPopulation = combinedPopulation + districtData.HVAP;
                   }
                   else if(demographic === "NATIVE_AMERICAN") {
                       combinedPopulation = combinedPopulation + districtData.AMINVAP;
                   }
                });
                districtLayers[key].setStyle({
                    fillColor: that.getDemographicColors(combinedPopulation, districtData.VAP),
                    opacity: 1,
                    fillOpacity: 0.8,
                    weight: 2,
                    color: 'white',
                });
            });
        });
    }

    demographicMapUpdateSelection(updatedDemographics) {
        if (Object.keys(updatedDemographics).length === 5) {
            this.setState({demographicsMapDisplay: Object.entries(updatedDemographics).filter(([d, chosen]) => chosen).map(([d, chosen]) => d)})
        }
    };


    getDemographicColors(demographicTotal, overall) {
            return (demographicTotal/overall)*100 > 80 ? '#49006a' :
                (demographicTotal/overall)*100 > 70 ? '#7a0177' :
                    (demographicTotal/overall)*100 > 60 ? '#ae017e' :
                        (demographicTotal/overall)*100 > 50 ? '#dd3497' :
                            (demographicTotal/overall)*100 > 40 ? '#f768a1' :
                                (demographicTotal/overall)*100 > 30 ? '#fa9fb5' :
                                    (demographicTotal/overall)*100 > 20 ? '#fcc5c0' :
                                        (demographicTotal/overall)*100 > 10 ? '#fde0dd' :
                                            '#fff7f3';
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
                [43, -70],
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

        L.easyButton('<h5>Back to US Map</h5>', function() {
            window.location.replace("/map");
        },  {position: 'topright'}).addTo(this.map);

        var that = this;

        this.loadDistrictNumber().then(districtIds =>
        {
            this.loadOriginalDistrictsIncrementally(this.map, districtIds, that)
        }).then(() => {
            this.loadStateData().then(precinctIds =>
            {
                this.loadPrecinctsIncrementally(precinctIds, that);
            });
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
                                districtData={this.state.districtData} stateData={this.state.stateData}
                                removeOriginalDisrtricts={this.removeOriginalDistrictLayer} precinctLayer={this.state.precinctLayer}
                                loadOriginalDistricts={this.loadOriginalDistricts} initializePhase1Map={this.initializePhase1Map}
                                phase1Update={this.phase1Update} phase0SelectedElection={this.phase0SelectedElection}
                                demographicMapUpdate={this.demographicMapUpdate} demographicMapUpdateSelection={this.demographicMapUpdateSelection}
                                election={this.state.election}/>
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
