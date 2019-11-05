import React, {Component} from 'react';
import Bar_Chart from "./Bar_Chart";

export default class State extends Component {
    render() {
        return (
          <Bar_Chart databar={databar}></Bar_Chart>
        );
    }
}

var databar =  {
    labels: ["James R. Langevin", "Rhue R. Reis", "Jeffrey C. Johnson", "Salvatore G. Caiozzo"],
        datasets: [
        {
            label: "Number of Votes",
            data: [3401, 2496, 653, 188],
            backgroundColor: [
                "rgba(255, 134,159,0.4)",
                "rgba(98,  182, 239,0.4)",
                "rgba(255, 218, 128,0.4)",
                "rgba(113, 205, 205,0.4)",
            ],
            borderWidth: 2,
            borderColor: [
                "rgba(255, 134, 159, 1)",
                "rgba(98,  182, 239, 1)",
                "rgba(255, 218, 128, 1)",
                "rgba(113, 205, 205, 1)",
            ]
        }
    ]
}