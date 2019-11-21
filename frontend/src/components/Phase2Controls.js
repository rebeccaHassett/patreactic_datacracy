import React, {Component} from 'react';
import {Button, Form, Row, Tab} from "react-bootstrap";
import Slider_Controls from "./SliderControl";
import styled from "styled-components";

export default class Phase2Controls extends Component {
    render() {
        return (
            <Phase2Styles>
            <Form>
                <Button id = "btn">Start Phase 2</Button>
                <Form.Group id="incremental">
                    <Form.Check label="Incremental"/>
                </Form.Group>
                <Form.Group id="ethnicGroups">
                    <Form.Label>Ethnic/Racial Groups:</Form.Label>
                    <Form.Check aria-label="option 1" label="African American"/>
                    <Form.Check aria-label="option 1" label="Asian"/>
                    <Form.Check aria-label="option 1" label="Hispanic"/>
                </Form.Group>
                <Form.Group id="maxVotePercentage">
                    <Form.Label className="label">Maximum Vote Percentage:</Form.Label>
                    <Slider_Controls></Slider_Controls>
                </Form.Group>
                <Form.Group id="minVotePercentage">
                    <Form.Label className="label">Minimum Vote Percentage:</Form.Label>
                    <Slider_Controls></Slider_Controls>
                </Form.Group>
                <Form.Group id="Compactness">
                    <Form.Label className="label">Compactness Measure:</Form.Label>
                    <Slider_Controls></Slider_Controls>
                </Form.Group>
                <Form.Group id="Contiguity">
                    <Form.Label className="label">Contiguity Measure:</Form.Label>
                    <Slider_Controls></Slider_Controls>
                </Form.Group>
                <Form.Group id="equalPopulation">
                    <Form.Label className="label">Equal Population Measure:</Form.Label>
                    <Slider_Controls></Slider_Controls>
                </Form.Group>
                <Form.Group id="partisanFairness">
                    <Form.Label className="label">Partisan Fairness Measure:</Form.Label>
                    <Slider_Controls></Slider_Controls>
                </Form.Group>
                <Form.Group id="blockVoting">
                    <Form.Label>Block Voting Measure:</Form.Label>
                    <Form.Label className="label">Minority Group Percentage:</Form.Label>
                    <Slider_Controls></Slider_Controls>
                    <Form.Label className="label">Voting Percentage:</Form.Label>
                    <Slider_Controls></Slider_Controls>
                </Form.Group>
                <Form.Group id="votingRightsAct">
                    <Form.Label>Voting Rights Act Information:</Form.Label>
                </Form.Group>
            </Form>
            </Phase2Styles>
        );
    };
}

const Phase2Styles = styled.div`
    .label {
      margin-bottom: 2.5vw;
    }
`;