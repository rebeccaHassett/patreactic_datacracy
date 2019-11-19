import React, {Component} from 'react';
import {Form} from "react-bootstrap";
import Slider_Controls from "./SliderControl";

export default class Controls extends Component {
    render() {
        return (
            <Form>
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
                <Form.Group id="maxVotePercentage">
                    <Form.Label>Maximum Vote Percentage:</Form.Label>
                    <Slider_Controls></Slider_Controls>
                </Form.Group>
                <Form.Group id="minVotePercentage">
                <Form.Label>Minimum Vote Percentage:</Form.Label>
                <Slider_Controls></Slider_Controls>
            </Form.Group>
                <Form.Group id="Compactness">
                    <Form.Label>Compactness Measure:</Form.Label>
                    <Slider_Controls></Slider_Controls>
                </Form.Group>
                <Form.Group id="Contiguity">
                    <Form.Label>Contiguity Measure:</Form.Label>
                    <Slider_Controls></Slider_Controls>
                </Form.Group>
                <Form.Group id="equalPopulation">
                    <Form.Label>Equal Population Measure:</Form.Label>
                    <Slider_Controls></Slider_Controls>
                </Form.Group>
                <Form.Group id="partisanFairness">
                    <Form.Label>Partisan Fairness Measure:</Form.Label>
                    <Slider_Controls></Slider_Controls>
                </Form.Group>
                <Form.Group id="blockVoting">
                    <Form.Label>Block Voting Measure:</Form.Label>
                    <Form.Label>Minority Group Percentage:</Form.Label>
                    <Slider_Controls></Slider_Controls>
                    <Form.Label>Voting Percentage:</Form.Label>
                    <Slider_Controls></Slider_Controls>
                </Form.Group>
                <Form.Group id="votingRightsAct">
                    <Form.Label>Voting Rights Act Information:</Form.Label>
                </Form.Group>
            </Form>
        );
    };
}