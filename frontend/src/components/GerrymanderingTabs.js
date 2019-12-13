import React from 'react';
import PropTypes from 'prop-types';
import {makeStyles, withStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import styled from "styled-components";

function TabPane(props) {
    const {children, value, index, ...other} = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`scrollable-auto-tabpanel-${index}`}
            aria-labelledby={`scrollable-auto-tab-${index}`}
            {...other}
        >
            <Box p={3} style={{paddingLeft: '0', paddingRight: '0',}}>{children}</Box>
        </Typography>
    );
}

TabPane.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

const useDataStyles = makeStyles(theme => ({
    root: {
        backgroundColor: theme.palette.background.paper,
    },
}));

const StyledDataTab = withStyles(theme => ({
    root: {
        textTransform: 'none',
        fontWeight: theme.typography.fontWeightRegular,
        fontSize: theme.typography.pxToRem(15),
        width: '12vw',
        minWidth: '12vw',
        display: 'flex',
        justifyContent: 'center',
        itemAlign: 'center',
    },
}))(props => <Tab {...props} />);

export default function DataTabs(props) {
    const classes = useDataStyles();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };


    let election;
    if (props.election === "Presidential 2016") {
        election = "pres2016";
    } else if (props.election === "Congressional 2016") {
        election = "house2016"
    } else if (props.election === "Congressional 2018") {
        election = "house 2018";
    }

    if (props.gerrymanderingScores) {
        return (
            <div className={classes.root}>
                <AppBar position="static" style={{width: '35vw', margin: 'auto'}} color="primary">
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        indicatorColor="secondary"
                        tabItemContainerStyle={{width: '20%'}}
                        contentContainerStyle={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        centered={true}
                    >
                        <StyledDataTab label="Efficiency Gap"/>
                        <StyledDataTab label="Lopsided Margins"/>
                        <StyledDataTab label="Mean-Median Difference"/>
                    </Tabs>
                </AppBar>
                <TabPane value={value} index={0}
                         style={{marginLeft: '0vw', paddingLeft: '2vw', marginRight: '0vw', paddingRight: '2vw'}}>
                    <DataStyle>
                        <h5>The efficiency gap is the number of wasted votes</h5>
                        <p>(# wasted republican - # wasted democratic) / 2-party vote total</p>
                        <p>Formula for district percentage vote gap is averaged for entire state</p>
                        <h2>{props.gerrymanderingScores.efficiencyGap[election]}% Wasted Votes</h2>
                    </DataStyle>
                </TabPane>
                <TabPane value={value} index={1}>
                    <DataStyle>
                        <h5>Lopsided Margins</h5>
                        <h2>{props.gerrymanderingScores.lopsidedMargins[election]}%</h2>
                    </DataStyle>
                </TabPane>
                <TabPane value={value} index={2}>
                    <h5>Mean district vote share - Median district vote share</h5>
                    <h5>Determines if state elections have skewed results</h5>
                    <h4>The median {props.gerrymanderingScores.winningParty[election]} vote share
                        is {props.gerrymanderingScores.meanMedianDiff[election]}% higher than the
                        mean {props.gerrymanderingScores.winningParty[election]} vote share</h4>
                </TabPane>
            </div>
        );
    } else {
        return (<div/>);
    }
}
const DataStyle = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    
    h4 {
        margin-bottom: 1vw;
        margin-top: 1vw;
    }
`;