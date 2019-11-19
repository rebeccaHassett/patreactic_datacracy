import React from 'react';
import {Jumbotron, Container, Image} from 'react-bootstrap';
import styled from 'styled-components';
import sky from '../resources/images/Sky.jpg'
import flagpole from '../resources/images/Flag.jpg'

const Banner = () => (
    <Banner_Style>
        <Jumbotron id="banner">
            <Container>
                Patreactic Datacracy
                <Image id="flagpole" src={flagpole} fluid/>
            </Container>
        </Jumbotron>
    </Banner_Style>
);

const Banner_Style = styled.div`
    #banner {
      background: url(${sky}) no-repeat;
      background-size: cover;
      height: 12vw;
      background-position: center;
      padding: 0;
      position: fixed;
      width: 100%;
      z-index: 3;
    }
    .container{
      font-size: 6.50vw;
      font-family: "Gabriola";       
      color: floralwhite; 
      text-shadow: 0 0 20px black, 0 0 22px black; 
      font-weight: 900;
      text-align: center;
      line-height: 2.45em;
    }
    #flagpole {
      height: 15.5vw;
      width: 15.5vw;
      position: fixed;
      border-radius: 80%;
      left: 83.5vw;
      top: 1vw;
    }
`;

export default Banner;