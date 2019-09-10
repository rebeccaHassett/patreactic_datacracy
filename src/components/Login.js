import React, {Component} from "react";
import {Button, FormGroup, FormControl, FormLabel, Container, Nav, Row, Col} from "react-bootstrap";
import {Link} from 'react-router-dom';
import "./styles/Login.css";

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            pwd: "",
            redirect_url: false
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }


    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    handleSubmit(event) {
    }

    render() {
        return (
            <div>
                <Container className="Login">
                    <h1 class="header">Login:</h1>
                    {<form onSubmit={this.handleSubmit}>
                        <Row>
                            <Col>
                                <FormGroup id="email" controlId="email">
                                    <FormLabel id="email-label">Email: </FormLabel>
                                    <FormControl autoFocus type="email" value={this.state.email}
                                                 onChange={this.handleChange}/>
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup id="password" controlId="password">
                                    <FormLabel id="password-label">Password: </FormLabel>
                                    <FormControl id="pwd_box" value={this.state.password} type="password"
                                                 onChange={this.handleChange}/>
                                </FormGroup>
                            </Col>
                            <Col>
                                <Link to={`/map`}>
                                    <Button type="submit" id="login-button">Login</Button>
                                </Link>
                            </Col>
                        </Row>
                    </form>}
                    <Row>
                        <Col>
                            <Button id="sign-up-button">Sign Up!</Button>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}