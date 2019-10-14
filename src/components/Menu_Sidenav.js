import React from 'react';
import { bubble as Menu } from 'react-burger-menu'
import {Button, Row, Tab, Tabs, Form} from "react-bootstrap";
import {Link} from "react-router-dom";
import Controls from "./Controls";
import styled from "styled-components";

class Menu_Sidenav extends React.Component {
    constructor() {
        super();
        this.state = {
            Tab1: false,
            Tab2: false,
            Tab3: true,
            Tab4: false,
            Tab5: false,
            Tab6: false,
            Tab7: false,
            Sidebar: true
        }
    }
    showSettings (event) {
        event.preventDefault();
    }

render () {
        return (
            <Menu styles={ styles } disableCloseOnEsc noOverlay left isOpen={true}>
                <Content_Style>
                <Tabs defaultActiveKey="menu" id="tabs">
                    <Tab eventKey="menu" title="Menu" disabled={this.state.Tab6}>
                        <Row>
                            <Link to='/map'>
                                <Button>Back to US Map</Button>
                            </Link>
                        </Row>
                        <Row>
                            <Button>Start</Button>
                            <Form>
                                <Form.Group controlId="incremental" id="incremental">
                                    <Form.Label>Incremental Run:</Form.Label>
                                    <Form.Check aria-label="option 1" label="Incremental"/>
                                </Form.Group>
                            </Form>
                        </Row>
                        <Row>
                            <Button disabled>Toggle to Original Districts</Button>
                        </Row>
                    </Tab>
                    <Tab eventKey="controls" title="Controls" disabled={this.state.Tab5}>
                        <Controls></Controls>
                    </Tab>
                </Tabs>
                </Content_Style>
            </Menu>
        );
    }
}

const Content_Style = styled.div`
    * {
        outline:none;
    }
    #incremental {
        color:lightblue;
    }
    Button {
        width: 23vw;
        margin-top: 2vw;
        background-color:lightblue;
        color:black;
        font-style:bold;
        border-color:black;
    }

    Tabs {
        border-color:white;
        outline:none;
    }
`;
var styles = {

    bmBurgerButton: {
        position: 'fixed',
        width: '4vw',
        height: '3vw',
        left: '1vw',
        top: '1vw'
    },
    bmBurgerBars: {
        background: '#373a47',
    },
    bmBurgerBarsHover: {
        background: '#a90000',

},
    bmCrossButton: {
        height: '3vw',
        width: '3vw',
        left:'1vw'
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
        padding: '2.5em 1.5em 0',
        fontSize: '1.15em',
        outline:'none'
    },
    bmMorphShape: {
        fill: '#373a47'
    },
    bmItemList: {
        color: '#b8b7ad',
        outline:'none !important',
        padding: '0.8em'
    },
    btmItem: {
        outline:'none'
    },

    bmOverlay: {
        background: 'rgba(0, 0, 0, 0.3)'
    }
}


export default Menu_Sidenav;