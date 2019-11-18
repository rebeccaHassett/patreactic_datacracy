import React, {Component} from 'react';
import {Container, Dropdown, DropdownItem} from "react-bootstrap";
import styled from "styled-components";
import L from "leaflet";
import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import {BrowserRouter as Router, Route} from 'react-router-dom';



export default class Map extends Component {

    componentDidMount() {
        var max_bounds = [
            [29, -122],
            [49, -70]
        ];

        // create map
        this.map = L.map('map', {
            center: [0, 0],
            zoom: 5,
            minZoom: 2.5,
            maxBounds: max_bounds,
            zoomControl: false,
            layers: [
                L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
                    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
                })
            ]
        }).fitBounds(max_bounds);

        addLayerToMap('http://localhost:8080/State_Borders?name=Rhode_Island', this.map, "Rhode Island");
        addLayerToMap('http://127.0.0.1:8080/State_Borders?name=Michigan', this.map, "Michigan");
        addLayerToMap('http://127.0.0.1:8080/State_Borders?name=North_Carolina', this.map, "North Carolina");

    }

    render() {
        return (
            <Map_Style>
                <Router>
                    <Route render={({ location, history }) => (
                        <React.Fragment>
                            <SideNav id = "sidenav"
                                onSelect={(selected) => {
                                    const to = '/' + selected;
                                    if (location.pathname !== to) {
                                        history.push(to);
                                        window.location.reload();
                                    }
                                }}
                            >
                                <SideNav.Toggle />
                                <SideNav.Nav>
                                    <NavItem eventKey="map">
                                        <NavIcon>
                                            <i className="fa fa-fw fa-line-chart" style={{ fontSize: '1.75em' }} />
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
                <Container>
                    <div id='map'></div>
                </Container>
            </Map_Style>
        );
    }

}

const Map_Style = styled.div`
    #sidenav {
        width: 7vw;
        background-color: darkseagreen
    }
    #map {
      height: 600px;
    }
`;

function addLayerToMap(url, map, name) {
    var layer;

    var map_style = {
        "color": "green"
    };

    var state = fetch(url).then(function (response) {
        if (response.status >= 400) {
            throw new Error("State geographicdata not loaded from server successfully");
        }
        return response.json();
    }).then(function (data) {
        console.log(data);
        layer = L.geoJSON(data, {style: map_style}).addTo(map);
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
                color: 'green'
            });
        });
        layer.on('click', function (e) {
            window.location.replace("/" + layer._tooltip._content.split(' ').join(''));
        });
        layer.bringToFront();
    });

}