import React, {Component} from 'react';
import {Container} from "react-bootstrap";
import styled from "styled-components";
import L from "leaflet";

import State_Borders from "../resources/GeoJSON/State_Borders";
import North_Carolina from '../resources/GeoJSON/North_Carolina_Data'
import Rhode_Island from "../resources/GeoJSON/Rhode_Island_Data";
import Michigan from "../resources/GeoJSON/Michigan";


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
            maxBounds: max_bounds,
            layers: [
                L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                }),
            ]
        }).fitBounds(max_bounds);

        var map_style = {
            "color": "green"
        };
        var state_style = {
            "color": "sienna"
        };


        L.geoJSON(State_Borders, {style: map_style}).addTo(this.map);


        var north_carolina_layer = L.geoJSON(North_Carolina, {style: state_style}).addTo(this.map);
        var rhode_island_layer = L.geoJSON(Rhode_Island, {style: state_style}).addTo(this.map);
        var michigan_layer = L.geoJSON(Michigan, {style: state_style}).addTo(this.map);


        var tooltip_options = {maxWidth: 200, autoClose: false, permanent: false, opacity: 0.8, offset: [-10, 0]};

        north_carolina_layer.bindTooltip("North Carolina", tooltip_options);
        rhode_island_layer.bindTooltip("Rhode Island", tooltip_options);
        michigan_layer.bindTooltip("Michigan", tooltip_options);


        var state_array = [north_carolina_layer, rhode_island_layer, michigan_layer];
        state_array.forEach(function (element) {
            element.on('mouseover', function (e) {
                var layer = e.target;
                layer.setStyle({
                    color: 'blue'
                });
            });
            element.on('mouseout', function (e) {
                var layer = e.target;
                layer.setStyle({
                    color: 'sienna'
                });
            });
            element.on('click', function (e) {
                window.location.replace("/" + element._tooltip._content.split(' ').join(''));
            });
        });
    }

    render() {
        return (
            <Map_Style>
                <Container>
                    <div id='map'></div>
                </Container>
            </Map_Style>
        );
    }

}

const Map_Style = styled.div`
    #map {
      height: 600px;
    }
`;

