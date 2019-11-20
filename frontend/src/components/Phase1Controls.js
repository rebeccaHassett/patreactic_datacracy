import React, {Component} from 'react';
import {Button, Form, Row, Tab} from "react-bootstrap";
import Slider_Controls from "./SliderControl";

export default class Phase1Controls extends Component {
    render() {
        return (
            <Form>
                <Button id = "btn">Start Phase 1</Button>
                <Form.Group id="incremental">
                    <Form.Check label="Incremental"/>
                </Form.Group>
                <Form.Group id="numberDistricts">
                    <Form.Label>Number of Congressional Districts:</Form.Label>
                    <Slider_Controls></Slider_Controls>
                </Form.Group>
                <Form.Group id="majorityMinorityDistricts">
                    <Form.Label>Number of Majority-Minority Districts</Form.Label>
                    <Slider_Controls></Slider_Controls>
                </Form.Group>
                <Form.Group id="ethnicGroups">
                    <Form.Label>Ethnic/Racial Groups:</Form.Label>
                    <Form.Check aria-label="option 1" label="African American"/>
                    <Form.Check aria-label="option 1" label="Asian"/>
                    <Form.Check aria-label="option 1" label="Hispanic"/>
                </Form.Group>
                <Form.Group id="minorityPopulationUpperThreshold">
                    <Form.Label>Minority Population Upper Threshold:</Form.Label>
                    <Slider_Controls></Slider_Controls>
                </Form.Group>
                <Form.Group id="minorityPopulationLowerThreshold">
                    <Form.Label>Minority Population Lower Threshold:</Form.Label>
                    <Slider_Controls></Slider_Controls>
                </Form.Group>
            </Form>
        );
    };
}

