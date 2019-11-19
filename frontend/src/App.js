import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import AppIntro from "./components/AppIntro";
import Map from './components/Map'
import State from "./components/State";

function App() {
    return (
        <Router>
            <link
                rel="stylesheet"
                href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
                integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
                crossOrigin="anonymous"
            />
            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.2.0/dist/leaflet.css"/>
            <script src="https://unpkg.com/leaflet@1.2.0/dist/leaflet.js"></script>
            <link rel="stylesheet" href="https://unpkg.com/react-rangeslider/umd/rangeslider.min.css"/>
            <div className="App">
                <Switch>
                    <Route exact path="/" component={AppIntro}/>
                    <Route exact path="/map" component={Map}/>
                    <Route exact path="/:state" component={State} />
                </Switch>
            </div>
        </Router>
    );
}

export default App;