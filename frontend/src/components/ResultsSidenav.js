import React from 'react';
import {slide as Menu} from 'react-burger-menu'
import {Tab, Tabs, Card} from "react-bootstrap";
import Statistics from "./Statistics";
import styled from "styled-components";
import L from "leaflet";

class ResultsSidenav extends React.Component {
    constructor() {
        super();
    }

    state = {
        laws: "",
        incumbents: ""
    }

    componentDidMount() {
        console.log(this.props.chosenState);
        this.state.laws = fetch('http://127.0.0.1:8080/laws/' + this.props.chosenState).then(function (response) {
            if (response.status >= 400) {
                console.log("Law data not loaded from server successfully");
            }
            return response.json();
        }).then(function (data) {
            return data.laws;
        });

        this.state.incumbents = fetch('http://127.0.0.1:8080/incumbent/' + this.props.chosenState).then(function (response) {
            if (response.status >= 400) {
                console.log("Incumbent data not loaded from server successfully");
            }
            return response.json();
        }).then(function (data) {
            return data;
        });
    }

    render() {
        return (
            <Menu styles={menuStyles} disableCloseOnEsc noOverlay right width={400}>
                <ContentStyle>
                    <Tabs className="tabs" defaultActiveKey="District" id="tabs">
                        <Tab eventKey="State" title="State">
                            <h3>_____________________________</h3>
                            <h4>Voting Incumbents</h4>
                            <p>{this.incumbents}</p>
                            <h4>Election and Demographics</h4>
                            <Statistics data={this.props.stateData}></Statistics>
                            <h4>Laws</h4>
                            <p>{this.laws}</p>
                        </Tab>
                        <Tab eventKey="District" title="District">
                            <h3>_____________________________</h3>
                            <h4>Election and Demographics</h4>
                            <Statistics data={this.props.districtData}></Statistics>
                        </Tab>
                        <Tab eventKey="Precinct" title="Precinct">
                            <h3>_____________________________</h3>
                            <h4>Election and Demographics</h4>
                            <Statistics data={this.props.precinctData}></Statistics>
                        </Tab>
                    </Tabs>
                </ContentStyle>
            </Menu>
        );
    }
}

const ContentStyle = styled.div`
    color: white;
    .tabs {
        font-size: 1.8vw;
    }
`;

var menuStyles = {
    bmBurgerButton: {
        position: 'fixed',
        width: '4vw',
        height: '3vw',
        right: '1vw',
        top: '1vw'
    },
    bmBurgerBars: {
        background: '#373a47',
    },
    bmMenuWrap: {
        position: 'fixed',
        height: '100%',
    },
    bmMenu: {
        background: '#373a47',
        padding: '2.1em 1.1em 0',
        fontSize: '1.15em',
    },
    bmItemList: {
        color: '#b8b7ad',
        padding: '0.8em',
        overflowX: 'hidden',
    },
    bmCrossButton: {
        height: '3vw',
        width: '3vw',
        left: '1vw'
    },
    bmCross: {
        background: '#bdc3c7'
    },
}


export default ResultsSidenav;