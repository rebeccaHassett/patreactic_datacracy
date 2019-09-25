import React, {Component} from 'react';
import Slider from 'react-rangeslider'
import 'react-rangeslider/lib/index.css'
import styled from "styled-components";

export default class Slider_Controls extends Component {
    constructor(props, context) {
        super(props, context)
        this.state = {
            volume: 0
        }
    }

    handleOnChange = (value) => {
        this.setState({
            volume: value
        })
    }

    render() {
        let { volume } = this.state
        return (
            <Slider id = "slider"
                value={volume}
                orientation="horizontal"
                onChange={this.handleOnChange}
            />
        )
    };
}