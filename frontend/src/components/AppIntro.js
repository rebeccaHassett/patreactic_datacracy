import React, {Component} from 'react';
import {Image, Container, Jumbotron, Button} from "react-bootstrap";
import Banner from "./Banner";
import "./styles/App_Intro.css"
import Eagle from '../resources/images/Eagle.jpg'
import {Link} from "react-router-dom";

class AppIntro extends Component {
    render() {
        return (
            <div id="app">
                <Banner></Banner>
                <Image id="eagle" src={Eagle}></Image>
                <Container id="details">
                    <h2 id="about">About Our Platform:</h2>
                    <h3>A data visualization web service bridging the gap between technology and
                        politics.</h3>
                    <p>We combat gerrymandering through integrating demographic, election result, county
                        boundary, and geographical precinct data to calculate the maximum number of majority-minority
                        congressional districts in a state. We take on the
                        challenge of analyzing states that have a large minority population or cover a large
                        geographical area. We optimally partition and form congressional districts
                        using different metrics such as equal population, compactness, laws, political fairness, and
                        minority group population percentage.</p>
                    <Link to={`/map`}>
                        <Button type="submit" id="loginButton">Launch!</Button>
                    </Link>
                </Container>
            </div>
        );
    }
}

export default AppIntro;