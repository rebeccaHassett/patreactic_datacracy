import React from 'react';
import { bubble as Menu } from 'react-burger-menu'
import {Button, Row, Tab, Tabs} from "react-bootstrap";
import {Link} from "react-router-dom";
import Controls from "./Controls";
import Statistics from "./Statistics";
import styled from "styled-components";

class Results_Sidenav extends React.Component {
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
        // NOTE: You also need to provide styles, see https://github.com/negomi/react-burger-menu#styling
        return (
            <Menu styles={ styles } disableCloseOnEsc noOverlay right width={400}>
                <Statistics></Statistics>
            </Menu>
        );
    }
}


var styles = {
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
    bmBurgerBarsHover: {
        background: '#a90000',
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
        padding: '2.5em 1.5em 0',
        fontSize: '1.15em',
    },
    bmMorphShape: {
        fill: '#373a47'
    },
    bmItemList: {
        color: '#b8b7ad',
        padding: '0.8em',
        overflow:'scroll',
        border:'none'
    },
    bmItem: {
        display: 'inline-block',
    },
    bmOverlay: {
        background: 'rgba(0, 0, 0, 0.3)'
    }
}


export default Results_Sidenav;