import React from 'react';
import { bubble as Menu } from 'react-burger-menu'
import { Tab, Tabs } from "react-bootstrap";
import Statistics from "./Statistics";
import styled from "styled-components";

class ResultsSidenav extends React.Component {
    render () {
        return (
            <Menu styles={ menuStyles } disableCloseOnEsc noOverlay right width={400}>
                <ContentStyle>
                <Tabs defaultActiveKey="District" id="tabs">
                    <Tab eventKey="State" title="State">
                        <h4>State Election and Demographic Data</h4>
                    </Tab>
                    <Tab eventKey="District" title="District">
                        <h4>District Election and Demographic Data</h4>
                    </Tab>
                    <Tab eventKey="Precinct" title="Precinct">
                        <h4>Precinct Election and Demographic Data</h4>
                        <Statistics data={this.props.precinctData}></Statistics>
                    </Tab>
                </Tabs>
                </ContentStyle>
            </Menu>
        );
    }
}

const ContentStyle = styled.div`
    Tabs {
        width: 4vw;
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
    bmCrossButton: {
        height: '24px',
        width: '24px'
    },
    bmCross: {
        background: '#bdc3c7'
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
        overflow:'scroll',
    },
}


export default ResultsSidenav;