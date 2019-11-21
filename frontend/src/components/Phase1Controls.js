import React, {Component} from 'react';
import {Button, Form, Row, Tab} from "react-bootstrap";
import Slider_Controls from "./SliderControl";
import styled from "styled-components";

export default class Phase1Controls extends Component {
    render() {
        return (
            <Phase1Styles>
            <Form>
                <Button id = "btn">Start Phase 1</Button>
                <Form.Group id="incremental">
                    <Form.Check label="Incremental"/>
                </Form.Group>
                <Form.Group id="numberDistricts">
                    <Form.Label className="label">Number of Congressional Districts:</Form.Label>
                    <Slider_Controls></Slider_Controls>
                </Form.Group>
                <Form.Group id="majorityMinorityDistricts">
                    <Form.Label className="label">Number of Majority-Minority Districts</Form.Label>
                    <Slider_Controls></Slider_Controls>
                </Form.Group>
                <Form.Group id="ethnicGroups">
                    <Form.Label>Ethnic/Racial Groups:</Form.Label>
                    <Form.Check aria-label="option 1" label="African American"/>
                    <Form.Check aria-label="option 1" label="Asian"/>
                    <Form.Check aria-label="option 1" label="Hispanic"/>
                </Form.Group>
                <Form.Group id="minorityPopulationUpperThreshold">
                    <Form.Label className="label">Minority Population Upper Threshold:</Form.Label>
                    <Slider_Controls></Slider_Controls>
                </Form.Group>
                <Form.Group id="minorityPopulationLowerThreshold">
                    <Form.Label className="label">Minority Population Lower Threshold:</Form.Label>
                    <Slider_Controls></Slider_Controls>
                </Form.Group>
            </Form>
            </Phase1Styles>
        );
    };
}

const Phase1Styles = styled.div`
    .label {
      margin-bottom: 2.5vw;
    }
`;