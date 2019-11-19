import React from 'react';
import {slide as Menu} from 'react-burger-menu'
import {Button, Row, Tab, Tabs, Form} from "react-bootstrap";
import {Link} from 'react-router-dom';
import Controls from "./Controls";
import styled from "styled-components";
import Slider_Controls from "./SliderControl";
import '@trendmicro/react-sidenav/dist/react-sidenav.css';


class MenuSidenav extends React.Component {
    constructor() {
        super();
        this.state = {
            phase1Tab: false,
            menuTab: false,
        }
    }

    render() {
        return (
            <Menu styles={menuStyles} disableCloseOnEsc noOverlay left isOpen={true}>
                <ContentStyle>
                    <Tabs  id="tabs" defaultActiveKey="menu">
                        <Tab id="menu" eventKey="menu" title="Menu" disabled={this.state.menuTab}>
                            <Row>
                                <Link to='/map'>
                                    <Button>Back to US Map</Button>
                                </Link>
                            </Row>
                            <Row>
                                <Button>Start</Button>
                                <Form>
                                    <Form.Group id="incremental">
                                        <Form.Label>Incremental Run:</Form.Label>
                                        <Form.Check label="Incremental"/>
                                    </Form.Group>
                                </Form>
                            </Row>
                            <Row>
                                <Button>Toggle to Original Districts</Button>
                            </Row>
                        </Tab>
                        <Tab eventKey="phase0" title="Phase 0">
                            <Form.Group id="bloc-population-percentage">
                                <Form.Label>Block Population Percentage Threshold:</Form.Label>
                                <Slider_Controls></Slider_Controls>
                            </Form.Group>
                            <Form.Group id="bloc-voting-percentage">
                                <Form.Label>Block Voting Percentage Threshold:</Form.Label>
                                <Slider_Controls></Slider_Controls>
                            </Form.Group>
                            <Form.Group id="election-types">
                                <Form.Label>Election Type</Form.Label>
                                <Form.Check aria-label="option 1" label="Congressional 2016"/>
                                <Form.Check aria-label="option 2" label="Congressional 2018"/>
                                <Form.Check aria-label="option 3" label="Presidential 2016"/>
                            </Form.Group>
                            <Button>Start Phase 0</Button>
                        </Tab>
                        <Tab eventKey="phase1" title="Phase 1" disabled={this.state.phase1Tab}>
                            <Controls></Controls>
                        </Tab>
                        <Tab eventKey="phase2" title="Phase 2" disabled={this.state.phase1Tab}>
                            <Controls></Controls>
                        </Tab>
                    </Tabs>
                </ContentStyle>
            </Menu>
        );
    }
}

const ContentStyle = styled.div`
    Form {
        color: black;
    }
    #incremental {
        color:black;
        padding-left: 2vw;
    }
    Button {
        width: 23vw;
        margin-top: 2vw;
        background-color:darkgray;
        color:black;
        font-style:bold;
        border-color:black;
        margin-left: 2vw;
    }
`;

var menuStyles = {
    bmCrossButton: {
        height: '3vw',
        width: '3vw',
        left: '1vw'
    },
    bmCross: {
        background: '#bdc3c7'
    },
    bmMenu: {
        background: 'darkseagreen',
        padding: '1.0em 1.0em 0',
        fontSize: '1.15em',
        width: '30vw'
    },
    bmItemList: {
        padding: '0.8em'
    },
}


export default MenuSidenav;