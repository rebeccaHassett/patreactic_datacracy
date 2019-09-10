import React, {Component} from 'react';
import {Image, Container, Row, Navbar, Nav, Col } from "react-bootstrap";
import styled from 'styled-components';
import Banner from "./Banner";
import Login from "./Login"
import Eagle from '../resources/images/Eagle.jpg'

class App_Intro extends Component {
    render() {
        return (
            <Intro_Style>
                <div className="App">
                        <Banner>
                        </Banner>
                    <Image id="Eagle" src={Eagle}></Image>
                    <Container className = "Details">
                        <h2 id = "About">About Our Platform:</h2>
                        <h3 className = "h3">A data visualization web service bridging the gap between technology and politics.</h3>
                        <p className = "p">We combat gerrymandering through integrating demographic, election result, county boundary, and geographical precinct data to calculate the maximum number of majority-minority congressional districts in a state. We take on the
                            challenge of analyzing states that have a large minority population or cover a large geographical area. We optimally partition and form congressional districts
                            using different metrics such as equal population, compactness, laws, political fairness, and minority group population percentage.</p>
                        <Login></Login>
                    </Container>
                </div>
            </Intro_Style>
        );
    }
}

export default App_Intro;

const Intro_Style = styled.div`
    .App {
    background-color: #F8F8F8;
    }
    .Details {
        position: relative;
        top: 13vw;
        font-family: "Helvetica";
        padding-left: 30vw;
    }
    
    #About {
        text-decoration: underline;
    }

    #Eagle {
      height: 100%;
      float: left;
      width: 30%;
      padding-top: 10vw;
      border-radius: 10%;   
    } 

`;