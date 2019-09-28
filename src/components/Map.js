import React, {Component} from 'react';
import {Container} from "react-bootstrap";
import styled from "styled-components";
import L from "leaflet";
import $ from "jquery";


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
            layers: [
                L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                }),
            ]
        }).fitBounds(max_bounds);

        addLayerToMap('http://127.0.0.1:8080/state_geographical_boundaries_data/States_Geographical_Data.json', this.map, "Map");
        addLayerToMap('http://127.0.0.1:8080/state_geographical_boundaries_data/Rhode_Island_State_Borders.json', this.map, "Rhode Island");
        addLayerToMap('http://127.0.0.1:8080/state_geographical_boundaries_data/Michigan_State_Borders.json', this.map, "Michigan");
        addLayerToMap('http://127.0.0.1:8080/state_geographical_boundaries_data/North_Carolina_State_Borders.json', this.map, "North Carolina");

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

function addLayerToMap(url, map, name) {
    var layer;

    var state_style = {
        "color": "sienna"
    };

    var map_style = {
        "color": "green"
    };

    var state = $.ajax({
        url: url,
        dataType: "json",
        success: console.log("State data successfully loaded."),
        fail: function (xhr) {
            alert(xhr.statusText)
        }
    })


    $.when(state).done(function () {
        if(name === "Map") {
            layer = L.geoJSON(state.responseJSON, {style: map_style}).addTo(map);
            layer.bringToBack();

        }
        if(name === "North Carolina" || name  === "Rhode Island" || name === "Michigan") {
            layer = L.geoJSON(state.responseJSON, {style: state_style}).addTo(map);
            var tooltip_options = {maxWidth: 200, autoClose: false, permanent: false, opacity: 0.8, offset: [-10, 0]};
            layer.bindTooltip(name, tooltip_options);

            layer.on('mouseover', function (e) {
                var layer = e.target;
                layer.setStyle({
                    color: 'blue'
                });
            });
            layer.on('mouseout', function (e) {
                var layer = e.target;
                layer.setStyle({
                    color: 'sienna'
                });
            });
            layer.on('click', function (e) {
                window.location.replace("/" + layer._tooltip._content.split(' ').join(''));
            });
            layer.bringToFront();
        }

    });
}