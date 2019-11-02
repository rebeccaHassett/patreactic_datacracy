import React, {Component} from 'react';
import {Container} from "react-bootstrap";
import styled from "styled-components";
import L from "leaflet";


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