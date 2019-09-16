import React, {Component} from 'react';
import {Form, Dropdown} from "react-bootstrap";
import Slider_Controls from "./Slider_Control";


export default class Controls extends Component {
    render() {
        return (
            <Form>
                <Form.Group controlId="number-districts">
                    <Form.Label>Number of Congressional Districts:</Form.Label>
                    <Slider_Controls></Slider_Controls>
                </Form.Group>
                <Form.Group controlId="majority-minority-districts">
                    <Form.Label>Number of Majority-Minority Districts</Form.Label>
                    <Slider_Controls></Slider_Controls>
                </Form.Group>
                <Form.Group controlId="ethnic-groups">
                    <Form.Label>Ethnic/Racial Groups:</Form.Label>
                    <Form.Check aria-label="option 1" label="African American"/>
                    <Form.Check aria-label="option 1" label="Asian"/>
                    <Form.Check aria-label="option 1" label="Hispanic"/>
                </Form.Group>
                <Form.Group controlId="max-vote-percentage">
                    <Form.Label>Maximum Vote Percentage:</Form.Label>
                    <Slider_Controls></Slider_Controls>
                </Form.Group>
                <Form.Group controlId="min-vote-percentage">
                <Form.Label>Minimum Vote Percentage:</Form.Label>
                <Slider_Controls></Slider_Controls>
            </Form.Group>
                <Form.Group controlId="compactness">
                    <Form.Label>Compactness Measure:</Form.Label>
                    <Slider_Controls></Slider_Controls>
                </Form.Group>
                <Form.Group controlId="contiguity">
                    <Form.Label>Contiguity Measure:</Form.Label>
                    <Slider_Controls></Slider_Controls>
                </Form.Group>
                <Form.Group controlId="equal-population">
                    <Form.Label>Equal Population Measure:</Form.Label>
                    <Slider_Controls></Slider_Controls>
                </Form.Group>
                <Form.Group controlId="partisan-fairness">
                    <Form.Label>Partisan Fairness Measure:</Form.Label>
                    <Slider_Controls></Slider_Controls>
                </Form.Group>
                <Form.Group controlId="voting-rights-act">
                    <Form.Label>Voting Rights Act Information:</Form.Label>
                </Form.Group>
            </Form>
        );
    };
}