import React, {Component} from 'react';
import styled from "styled-components";


export default class StatewideVotingPatterns extends Component {

    render() {
        var stateData = this.props.stateData;
        var districtData = this.props.districtData;
        if (stateData === "" || stateData === null || districtData === "" || districtData === "") {
            return null;
        } else {
            let stateJsonData;
            if (typeof (stateData) === 'string') {
                stateJsonData = JSON.parse(stateData);
            } else {
                stateJsonData = stateData;
            }

            var stateRepublicanVotes = 0;
            var stateDemocraticVotes = 0;
            var percentDemocraticParty = 0;
            var percentRepublicanParty = 0;
            var districtDemocraticVotes = 0;
            var districtRepublicanVotes = 0;
            var republicanRepresentatives = 0;
            var democraticRepresentatives = 0;
            var percentDemocraticRepresentatives = 0;
            var percentRepublicanRepresentatives = 0;

            let that = this;
            Object.keys(this.props.originalDistrictDataMap).forEach(function (key) {
                let districtJsonData;
                if (typeof (that.props.originalDistrictDataMap[key]) === 'string') {
                    districtJsonData = JSON.parse(that.props.originalDistrictDataMap[key]);
                } else {
                    districtJsonData = that.props.originalDistrictDataMap[key];
                }

                if (that.props.election.split(" ")[0] === "Presidential") {
                    districtRepublicanVotes = districtJsonData.PRES16R;
                    districtDemocraticVotes = districtJsonData.PRES16D;

                    if(districtDemocraticVotes > districtRepublicanVotes) {
                        democraticRepresentatives = democraticRepresentatives + 1;
                    }
                    else if(districtRepublicanVotes > districtDemocraticVotes) {
                        republicanRepresentatives = republicanRepresentatives + 1;
                    }

                } else {
                    var district_voting_data;
                    if (that.props.election.split(" ")[1] === '2016') {
                        district_voting_data = districtJsonData.HOUSE_ELECTION_16;
                    } else {
                        district_voting_data = districtJsonData.HOUSE_ELECTION_18;
                    }
                    var districtRepublicanKey;
                    var districtDemocraticKey;
                    for (var key in district_voting_data) {
                        if (key[key.length - 1] === 'D') {
                            districtDemocraticKey = key;
                        } else if (key[key.length - 1] === 'R') {
                            districtRepublicanKey = key;
                        }
                    }
                    districtRepublicanVotes = district_voting_data[districtRepublicanKey];
                    districtDemocraticVotes = district_voting_data[districtDemocraticKey];

                    if(districtRepublicanVotes > districtDemocraticVotes) {
                        republicanRepresentatives = republicanRepresentatives + 1;
                    }
                    else if(districtDemocraticVotes > districtRepublicanVotes) {
                        democraticRepresentatives = democraticRepresentatives + 1;
                    }
                }
            });

            if (this.props.election.split(" ")[0] === "Presidential") {
                stateRepublicanVotes = stateJsonData.PRES16R;
                stateDemocraticVotes = stateJsonData.PRES16D;

                percentDemocraticParty = ((stateDemocraticVotes / (stateDemocraticVotes + stateRepublicanVotes)) * 100);
                percentRepublicanParty = ((stateRepublicanVotes / (stateDemocraticVotes + stateRepublicanVotes)) * 100);
            } else {
                var state_voting_data;
                if (this.props.election.split(" ")[1] === '2016') {
                    state_voting_data = stateJsonData.HOUSE_ELECTION_16;
                } else {
                    state_voting_data = stateJsonData.HOUSE_ELECTION_18;
                }
                var stateRepublicanKey;
                var stateDemocraticKey;
                for (var key in state_voting_data) {
                    if (key[key.length - 1] === 'D') {
                        stateDemocraticKey = key;
                    } else if (key[key.length - 1] === 'R') {
                        stateRepublicanKey = key;
                    }
                }
                stateRepublicanVotes = state_voting_data[stateRepublicanKey];
                stateDemocraticVotes = state_voting_data[stateDemocraticKey];

                percentDemocraticParty = ((stateDemocraticVotes / (stateDemocraticVotes + stateRepublicanVotes)) * 100);
                percentRepublicanParty = ((stateRepublicanVotes / (stateDemocraticVotes + stateRepublicanVotes)) * 100);
            }

            var total = democraticRepresentatives + republicanRepresentatives;

            if(total === 0) {
                percentRepublicanRepresentatives = 0;
                percentDemocraticRepresentatives = 0;
            }
            else {
                percentDemocraticRepresentatives = ((democraticRepresentatives / (total)) * 100);
                percentRepublicanRepresentatives = ((republicanRepresentatives / (total)) * 100);
            }

        }


        return (
            <StatisticsStyles>
                <h4>Statewide Voting Patterns</h4>
                <h6>{percentDemocraticParty.toFixed(2)}% Democratic Votes vs. {percentRepublicanParty.toFixed(2)}% Republican Votes</h6>
                <h6>{democraticRepresentatives} Democratic Representatives vs. {republicanRepresentatives} Republican Representatives</h6>
                <h6>{percentDemocraticRepresentatives.toFixed(2)}% Democratic Representatives vs. {percentRepublicanRepresentatives.toFixed(2)}% Republican Representatives</h6>
            </StatisticsStyles>
        );
    };
}

const StatisticsStyles = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    h4 {
        margin-top: 1vw;
        margin-bottom: 1vw;
    }

    .bolden {
      font-weight: bold;
      text-decoration: underline;
      
    }   
 `;