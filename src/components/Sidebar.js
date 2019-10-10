import React, {Component} from 'react';
import {Tabs, Tab, Button, Row} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import Statistics from "./Statistics";
import Controls from "./Controls";
import styled from "styled-components";
import $ from 'jquery';
import {Col} from "react-bootstrap";

export default class Sidebar extends Component {
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
        this.setState(oldState => ({ Sidebar: !oldState.Sidebar }));
    }
    render() {
        return (
            <Sidebar_Style>
                <div className="wrapper">
                <nav id="sidebar">
                    <Tabs defaultActiveKey="menu">
                        <Tab eventKey="menu" title="Menu" disabled={this.state.Tab6}>
                            <Row>
                            <Link to='/map'>
                                <Button>Back to US Map</Button>
                            </Link>
                            </Row>
                            <Row>
                            <Button>Import Election Data</Button>
                            </Row>
                            <Row>
                            <Button>Import Boundary Data</Button>
                            </Row>
                            <Row>
                            <Button disabled>Toggle to Original Districts</Button>
                            </Row>
                        </Tab>
                        <Tab eventKey="controls" title="Controls" disabled={this.state.Tab5}>

                            <Controls></Controls>
                        </Tab>
                        <Tab eventKey="statistics" title="Statistics" disabled={this.state.Tab7}>
                            <Statistics></Statistics>
                        </Tab>
                    </Tabs>
                </nav>

            </div>
            </Sidebar_Style>

        );
    }
}

const Sidebar_Style = styled.div`
 @import "https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700";


body {
    font-family: 'Poppins', sans-serif;
    background: white;
}

p {
    font-family: 'Poppins', sans-serif;
    font-size: 1.1em;
    font-weight: 300;
    line-height: 1.7em;
    color: black;
}

a, a:hover, a:focus {
    color: inherit;
    text-decoration: none;
    transition: all 0.3s;
}
    Button {
        width:22vw;
        margin-top: 1vw;
    }

#sidebar {
    background: lightgray;
    color: black;
    transition: all 0.3s;
    height: 50vw;
    overflow-y: scroll;
    padding-left: 1.5vw;
    width: 24vw;
}

#sidebar .sidebar-header {
    background: white;
}

#sidebar ul.components {
    padding: 20px 0;
    border-bottom: 1px solid #47748b;
}

#sidebar ul p {
    color: #fff;
    padding: 10px;
}

#sidebar ul li a {
    padding: 10px;
    font-size: 1.1em;
    display: block;
}
#sidebar ul li a:hover {
    color: white;
    background: #fff;
}

#sidebar ul li.active > a, a[aria-expanded="true"] {
    color: #fff;
    background: #6d7fcc;
}
ul ul a {
    font-size: 0.9em !important;
    padding-left: 30px !important;
    background: #6d7fcc;
}
`;

