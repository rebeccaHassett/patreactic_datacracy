import React, {Component} from 'react';
import {Form, Dropdown} from "react-bootstrap";
import Slider_Controls from "./Slider_Control";


export default class Controls extends Component {
    render() {
        return (
            <Form>
                <Form.Group controlId="number-districts">
                    <Form.Label>Number of Majority-Minority Districts</Form.Label>
                    <Slider_Controls></Slider_Controls>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Ethnic/Racial Groups:</Form.Label>
                    <Form.Check aria-label="option 1" label="African American"/>
                    <Form.Check aria-label="option 1" label="Asian"/>
                    <Form.Check aria-label="option 1" label="Hispanic"/>
                </Form.Group>
            </Form>
        );
    };
}