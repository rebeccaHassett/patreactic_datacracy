import React from 'react';
import {slide as Menu} from 'react-burger-menu'
import {Button, Row, Tab, Tabs, Form} from "react-bootstrap";
import {Link} from 'react-router-dom';
import Phase0Controls from "./Phase0Controls";
import Phase1Controls from "./Phase1Controls";
import Phase2Controls from "./Phase2Controls";
import styled from "styled-components";
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
                    <Tabs className="tabs" defaultActiveKey="menu">
                        <Tab eventKey="menu" title="Menu" disabled={this.state.menuTab}>
                            <Row>
                                <Link to='/map'>
                                    <Button className="menuBtn">Back to US Map</Button>
                                </Link>
                            </Row>
                            <Row>
                                <Button className="menuBtn">Toggle to Original Districts</Button>
                            </Row>
                        </Tab>
                        <Tab eventKey="phase0" title="Phase 0">
                            <Phase0Controls state={this.props.state}></Phase0Controls>
                        </Tab>
                        <Tab eventKey="phase1" title="Phase 1" disabled={this.state.phase1Tab}>
                            <Phase1Controls></Phase1Controls>
                        </Tab>
                        <Tab eventKey="phase2" title="Phase 2" disabled={this.state.phase1Tab}>
                            <Phase2Controls></Phase2Controls>
                        </Tab>
                    </Tabs>
                </ContentStyle>
            </Menu>
        );
    }
}

const ContentStyle = styled.div`
    .tabs {
      font-size: 1.5vw;
    }
    Form {
        color: white;
    }
    .label {
        margin-bottom: 2.5vw;
    }
    #incremental {
        color: white;
        padding-left: 2vw;
    }
    Button {
        width: 23vw;
        margin-top: 2vw;
        font-style:bold;
        border-color:black;
    }
    .menuBtn {
        margin-left: 2vw;
    }
`;

var menuStyles = {
    bmMenu: {
        background: '#373a47',
        padding: '1.0em 1.0em 0',
        fontSize: '1.15em',
        width: '30vw'
    },
    bmItemList: {
        padding: '0.8em'
    },
}


export default MenuSidenav;