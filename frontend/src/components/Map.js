import React, {Component} from 'react';
import {Container} from "react-bootstrap";
import styled from "styled-components";
import L from "leaflet";
import SideNav, {NavItem, NavIcon, NavText} from '@trendmicro/react-sidenav';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import { Place } from '@material-ui/icons';



export default class Map extends Component {

    componentDidMount() {
        var maxMapBounds = [
            [29, -127],
            [49, -70]
        ];

        this.map = L.map('map', {
            center: [0, 0],
            zoom: 0,
            minZoom: 0,
            maxBounds: maxMapBounds,
            zoomControl: false,
            layers: [
                L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
                    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
                })
            ]
        }).fitBounds(maxMapBounds);

        addLayerToMap('http://localhost:8080/State_Borders?name=Rhode_Island', this.map, "Rhode Island");
        addLayerToMap('http://127.0.0.1:8080/State_Borders?name=Michigan', this.map, "Michigan");
        addLayerToMap('http://127.0.0.1:8080/State_Borders?name=North_Carolina', this.map, "North Carolina");
    }

    render() {
        return (
            <MapStyle>
                <Router>
                    <Route render={({location, history}) => (
                        <React.Fragment>
                            <SideNav id="sidenav"
                                     onSelect={(selected) => {
                                         const to = '/' + selected;
                                         if (location.pathname !== to) {
                                             history.push(to);
                                             window.location.reload();
                                         }
                                     }}
                            >
                                <SideNav.Toggle/>
                                <SideNav.Nav>
                                    <NavItem eventKey="stateMenu">
                                        <NavIcon>
                                            <Place></Place>
                                        </NavIcon>
                                        <NavText>
                                            State
                                        </NavText>
                                        <NavItem eventKey="RhodeIsland">
                                            <NavText>
                                                Rhode Island
                                            </NavText>
                                        </NavItem>
                                        <NavItem eventKey="Michigan">
                                            <NavText>
                                                Michigan
                                            </NavText>
                                        </NavItem>
                                        <NavItem eventKey="NorthCarolina">
                                            <NavText>
                                                North Carolina
                                            </NavText>
                                        </NavItem>
                                    </NavItem>
                                </SideNav.Nav>
                            </SideNav>
                        </React.Fragment>
                    )}
                    />
                </Router>
                    <div id='map'></div>
            </MapStyle>
        );
    }
}

function addLayerToMap(url, map, name) {
    var layer;

    fetch(url).then(function (response) {
        if (response.status >= 400) {
            throw new Error("State geographical data not loaded from server successfully");
        }
        return response.json();
    }).then(function (data) {
        layer = L.geoJSON(data).addTo(map);
        layer.setStyle({
            color: 'dodgerblue'
        })

        var tooltip_options = {maxWidth: 200, autoClose: false, permanent: false, opacity: 0.8, offset: [-10, 0]};
        layer.bindTooltip(name, tooltip_options);

        layer.on('mouseover', function (e) {
            var layer = e.target;
            layer.setStyle({
                color: 'sienna'
            });
        });

        layer.on('mouseout', function (e) {
            var layer = e.target;
            layer.setStyle({
                color: 'dodgerblue'
            });
        });

        layer.on('click', function (e) {
            window.location.replace("/" + layer._tooltip._content.split(' ').join(''));
        });
    });
}


const MapStyle = styled.div`
    #sidenav {
        width: 5vw;
        background-color: dodgerblue;
        font-weight: bold;
        font-size: 10vw;
        color: white;
    }
    #map {
          height: 49vw;
          width: 100vw;
    }
`;
