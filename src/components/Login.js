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
                    {<form onSubmit={this.handleSubmit}>
                        <Link to={`/map`}>
                            <Button type="submit" id="login-button">Launch!</Button>
                        </Link>
                    </form>}
                </Container>
            </div>
        );
    }
}