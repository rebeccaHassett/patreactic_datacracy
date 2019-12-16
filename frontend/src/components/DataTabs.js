import React from 'react';
import PropTypes from 'prop-types';
import {makeStyles, withStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Statistics from "./Statistics";
import TableDisplay from "./controls/TableDisplay";
import Button from "@material-ui/core/Button";
import styled from "styled-components";
import TextField from '@material-ui/core/TextField';
import CheckboxControl from "./controls/CheckboxControl";
import AlertDialogSlide from "./controls/AlertControl";

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
    const [originalColoringDisabled, setOriginalColoringDisabled] = React.useState(true);
    const [alertDialogState, setAlertDialogState] = React.useState(false);
    let [, setState] = React.useState();
    const incumbent_columns = [
        {id: 'districtId', label: 'District', format: value => value.toLocaleString(),},
        {id: 'incumbent', label: 'Incumbent', format: value => value.toLocaleString(),},
    ];

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    function initDemographicMapUpdate() {
        if(props.demographicsSelected.length === 0) {
         setAlertDialogState(true);
        }
        else {
            props.demographicMapUpdate(true);
            setOriginalColoringDisabled(false);
        }
    }

    function setOriginalColoring() {
        props.demographicMapUpdate(false);
        setOriginalColoringDisabled(true);
    }

    function handleAlertDialogState(value) {
        setAlertDialogState(value);
    }

    if(props.demographicDistributionDisabled && !originalColoringDisabled) {
        setOriginalColoringDisabled(true);
    }

    return (
        <div className={classes.root}>
            <AlertDialogSlide exportState={handleAlertDialogState} open={alertDialogState}
                              alert="Must Select At Least One Demographic"/>
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
                    <StyledDataTab label="State"/>
                    <StyledDataTab label="District"/>
                    <StyledDataTab label="Precinct"/>
                </Tabs>
            </AppBar>
            <TabPane value={value} index={0}
                     style={{marginLeft: '0vw', paddingLeft: '2vw', marginRight: '0vw', paddingRight: '2vw'}}>
                <DataStyle>
                    <h4 style={{fontWeight: 'bold', textDecoration: 'underline'}}>Voting Incumbents:</h4>
                    <TableDisplay columns={incumbent_columns} rows={props.incumbents}/>
                    <h4 style={{fontWeight: 'bold', textDecoration: 'underline'}}>Redistricting Laws:</h4>
                    <TextField variant="filled" color="primary" value={props.laws} multiline={true}
                               style={{width: "100%", marginBottom: '2vw'}}/>
                    <Statistics data={props.stateData} type="state" election={props.election}/>
                </DataStyle>
            </TabPane>
            <TabPane value={value} index={1}>
                <DataStyle>
                    <Statistics data={props.districtData} type="district" election={props.election}/>
                    <h4>Demographic Map Display</h4>
                    <CheckboxControl exportState={props.demographicMapUpdateSelection}
                                     disabled={props.demographicDistributionDisabled}
                                     helperText=""/>
                    <Button variant="contained" color="primary"
                            style={{width: '25vw', marginBottom: '2vw',}} onClick={initDemographicMapUpdate}
                            disabled={props.demographicDistributionDisabled}>
                        Display Demographics
                    </Button>
                    <Button variant="contained" color="primary"
                            style={{width: '25vw', marginBottom: '2vw',}} onClick={setOriginalColoring}
                            disabled={originalColoringDisabled}>
                        Revert Original Coloring
                    </Button>
                </DataStyle>
            </TabPane>
            <TabPane value={value} index={2}>
                <Statistics data={props.precinctData} type="precinct" election={props.election} chosenState={props.chosenState}/>
            </TabPane>
        </div>
    );
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