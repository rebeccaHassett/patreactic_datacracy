import React, {Component} from 'react';
import L from 'leaflet';
import {Container, Button, Tabs, Tab, Row, Col, Accordion, Image} from "react-bootstrap";
import styled from 'styled-components';
import Precinct from "./Precinct";
import Cluster from "./Cluster";
import Menu_Sidenav from "./Menu_Sidenav";
import Results_Sidenav from './Results_Sidenav';

export default class State extends Component {
    constructor() {
        super();
        this.state = {
            Tab2: false,
            Tab3: true,
            Sidebar: true,
            precinct_data: ""
        }

        this.toggleBox = this.toggleBox.bind(this);
    }


    /* Changing state of tab on/off*/
    onChangeHandler = e => {
        console.log(e.target.value);
        if (e.target.value === 'no') {
            this.setState({Tab13: true});
        } else {
            this.setState({Tab3: false});
        }
    };

    toggleBox() {
        this.setState(oldState => ({Sidebar: !oldState.Sidebar}));
    }

    componentDidMount() {
        var max_bounds;
        var min_zoom;
        var clusters_url;
        var precincts_displayed = false;
        var chosen_state = window.location.pathname.split("/").pop();

        console.log(chosen_state);

        if (chosen_state === "NorthCarolina") {
            clusters_url = 'http://127.0.0.1:8080/District_Borders?name=North_Carolina';

            max_bounds = [
                [37, -71],               /* North East */
                [33, -86]                /* South West */
            ];
            min_zoom = 6;
        } else if (chosen_state === "RhodeIsland") {
            clusters_url = 'http://127.0.0.1:8080/District_Borders?name=Rhode_Island';
            max_bounds = [
                [43, -70.75],
                [40, -72]
            ];
            min_zoom = 9;
        } else { /*Michigan*/
            clusters_url = 'http://127.0.0.1:8080/District_Borders?name=Michigan';
            max_bounds = [
                [49, -75],
                [40, -93]
            ];
            min_zoom = 6;

        }

        // create map
        this.map = L.map('map', {
            maxZoom: 20,
            minZoom: min_zoom,
            maxBounds: max_bounds,
            maxBoundsViscosity: 1.0,
            layers: [
                L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
                    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
                })
            ]
        }).fitBounds(max_bounds);

        var that = this;
        this.map.on("zoomend", function (event) {
            if (this.getZoom() >= 7) {
                var precincts_url;
                const precincts = new Precinct();
                precincts_displayed = true;
                if (chosen_state === "RhodeIsland") {
                    precincts_url = 'http://127.0.0.1:8080/Precinct_Borders?name=Rhode_Island'
                } else if (chosen_state === "NorthCarolina") {
                    precincts_url = 'http://127.0.0.1:8080/Precinct_Borders?name=North_Carolina'
                } else {
                    precincts_url = 'http://127.0.0.1:8080/Precinct_Borders?name=Michigan'
                }

                precincts.addPrecinctsToDistricts(precincts_url, this)
                    .then(precinct_layer => precincts.addPrecinctsToDistricts(precincts_url, this))
                    .then(precinct_layer => {
                        precinct_layer.on('mouseover', function (event) {
                            that.setState({precinct_data: JSON.stringify(event.layer.feature.properties)})
                        });
                        return true;
                    })
                    .catch(err => console.log(err));
            }
        })

        const clusters = new Cluster();
        clusters.addClustersToState(clusters_url, this.map)
            .then(cluster_layer => clusters.addClustersToState(clusters_url, this.map))
            .then(cluster_layer =>
                {console.log(cluster_layer);
                    /*cluster_layer.on('mouseover', function(event) {
                        console.log(event.layer.feature.properties);
                        if(parseInt(event.layer.feature.properties.NAME,10) % 2 === 0 || parseInt(event.layer.feature.properties.CD116FP,10) % 2 === 0 || parseInt(event.layer.feature.properties.CD115FP,10) % 2 === 0) {
                            that.setState({even:true});
                        }
                        else {
                            that.setState({even:false});
                        }
                    });*/
                return true;})
            .catch(err => console.log(err));

    }

    render() {
        return (
            <State_Style>
                <Row>
                    <Menu_Sidenav side="left" id="menu"></Menu_Sidenav>
                    <Col>
                        <Container>
                            <body>
                            <div id='map'></div>
                            </body>
                        </Container>
                    </Col>
                    <Results_Sidenav precinct_data={this.state.precinct_data}></Results_Sidenav>
                </Row>
            </State_Style>
        );
    }
}

const State_Style = styled.div`
    overflow:hidden;
    #map {
      height: 600px;
    }
    #content{
        position: absolute;
        float:left;
        z-index: 400;
        left: 0.5vw;
        width: 10vw;
     }
    #col-1 Button {
        width:24vw;
        margin-top: 1vw;
    }
    Button:disabled {
        background-color: blue;
    }

`;