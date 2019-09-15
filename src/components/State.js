import React, {Component} from 'react';
import L from 'leaflet';
import {Container, Button, Tabs, Tab} from "react-bootstrap";
import styled from 'styled-components';
import {Link} from 'react-router-dom';
import Controls from "./Controls";
/*import State_Borders from "../resources/GeoJSON/State_Borders";
import Michigan from "../resources/GeoJSON/Michigan";
import $ from 'jquery';*/

export default class State extends Component {

    setStateDistrictLayers = (chosen_state) => {

    }


    componentDidMount() {
        var map_test;
        var max_bounds;
        var chosen_state = window.location.pathname.split("/").pop();

        if (chosen_state === "NorthCarolina") {
            max_bounds = [
                [36, -81],
                [33, -80]
            ];
        } else if (chosen_state === "RhodeIsland") {
            max_bounds = [
                [41, -72],
                [42, -71]
            ];
        } else { /*Michigan*/
            max_bounds = [
                [41.5, -90.6],
                [48, -79.5]
            ];
        }

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

        map_test = this.map;


        // Fetch the geojson file
        // $.getJSON('../resources/GeoJSON/Michigan_U.S_Congressional_Districts_Geography.json', function (data) {
        //     // Define the geojson layer and add it to the map
        //     L.geoJson(data).addTo(this.map);
        // });

        const xhr = new XMLHttpRequest();
        xhr.open('GET', '../resources/GeoJSON/Michigan_U.S_Congressional_Districts_Geography.json');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.responseType = 'json';
        xhr.onload = function() {
            if (xhr.status !== 200) return
            console.log(xhr.response);
            L.geoJSON(xhr.response).addTo(map_test);
        };
        xhr.send();



/*        var districts = $.ajax({
            url: '../resources/GeoJSON/Michigan_U.S_Congressional_Districts_Geography.json',
            dataType: "json",
            success: console.log("County data successfully loaded."),
            error: function(xhr) {
                alert(xhr.statusText)
            }
        })

        $.when(districts).done(function() {
           L.geoJSON(districts.responseJSON).addTo(this.map);
        });*/

    }

    render() {
        return (
            <State_Style>
                <Link to='/map'>
                    <Button>Back</Button>
                </Link>
                <Tabs defaultActiveKey="map" id="tabs">
                    <Tab eventKey="Input" title="Input">
                        <Controls></Controls>
                    </Tab>
                    <Tab eventKey="map" title="Map">
                        <Container>
                            <div id='map'></div>
                        </Container>
                    </Tab>
                    <Tab eventKey="results" title="Results">
                        <h1>Insert Results Here!</h1>
                    </Tab>
                </Tabs>
            </State_Style>
        );
    }
}

const State_Style = styled.div`
    #map {
      height: 600px;
    }
`;

function fetchJSON(url) {
    return fetch(url)
        .then(function(response) {
            return response.json();
        });
}