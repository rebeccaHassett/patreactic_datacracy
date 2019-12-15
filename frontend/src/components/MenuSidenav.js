import React from 'react';
import PropTypes from 'prop-types';
import {makeStyles, withStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Phase0Controls from "./Phase0Controls";
import Phase1Controls from "./Phase1Controls";
import Phase2Controls from "./Phase2Controls";
import DataDisplay from "./DataDisplay";
import {spacing} from '@material-ui/system';

function TabPanel(props) {
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
            <Box p={3}
                 style={{paddingLeft: '0', paddingRight: '0', overflow: 'scroll', height: '100vh'}}>{children}</Box>
        </Typography>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: theme.palette.background.paper,
    },
}));

const StyledTab = withStyles(theme => ({
    root: {
        textTransform: 'none',
        fontWeight: theme.typography.fontWeightRegular,
        fontSize: theme.typography.pxToRem(15),
        width: '10vw',
        minWidth: '10vw',
        justifyContent: 'center',
        itemAlign: 'center',
    },
}))(props => <Tab {...props} />);

export default function MenuSidenav(props) {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);
    const [phase0ControlsTabDisabled, setPhase0ControlsTabDisabled] = React.useState(false); // phase 0 controls tab initially enabled
    const [phase1ControlsTabDisabled, setPhase1ControlsTabDisabled] = React.useState(false); // phase 1 controls tab initially enabled
    const [phase2ControlsTabDisabled, setPhase2ControlsTabDisabled] = React.useState(true); // phase 2 controls tab initially disabled
    const [districtToggleDisabled, setDistrictToggleDisabled] = React.useState(true); // district toggle initially disabled

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const togglePhase2ControlsTabDisabled = (value) => {
        setPhase2ControlsTabDisabled(value);
    };

    const togglePhase1ControlsTabDisabled = (value) => {
        setPhase1ControlsTabDisabled(value);
    };

    const togglePhase0ControlsTabDisabled = (value) => {
        setPhase0ControlsTabDisabled(value);
    };

    const handleDistrictToggleDisabled = (value) => {
        setDistrictToggleDisabled(value);
    };

    const restartPhase0Tab = () => {
        setValue(0);
    };

    return (
        <div className={classes.root}>
            <AppBar position="static" color="default">
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    contentContainerStyle={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    centered={true}
                >
                    <StyledTab label="Phase 0"/>
                    <StyledTab label="Phase 1"/>
                    <StyledTab label="Phase 2"/>
                    <StyledTab label="Data"/>
                </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}
                      style={{marginLeft: '0px', paddingLeft: '0px', marginRight: '0px', paddingRight: '0px'}}>
                <Phase0Controls state={props.chosenState} phase0SelectedElection={props.phase0SelectedElection}
                                phase0ControlsTabDisabled={phase0ControlsTabDisabled}/>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <Phase1Controls chosenState={props.chosenState}
                                removeOriginalDisrtricts={props.removeOriginalDisrtricts}
                                removePrecinctLayer={props.removePrecinctLayer} precinctLayer={props.precinctLayer}
                                handlePrecinctFeatures={props.handlePrecinctFeatures}
                                initializePhase1Map={props.initializePhase1Map} phase1Update={props.phase1Update}
                                election={props.election} numOriginalPrecincts={props.numOriginalPrecincts}
                                handleDistrictToggleDisabled={handleDistrictToggleDisabled} togglePhase0ControlsTabDisabled={togglePhase0ControlsTabDisabled}
                                togglePhase2ControlsTabDisabled={togglePhase2ControlsTabDisabled}
                                phase1ControlsTabDisabled={phase1ControlsTabDisabled}
                                restartPhase0Tab={restartPhase0Tab}/>
            </TabPanel>
            <TabPanel value={value} index={2}>
                <Phase2Controls phase2Update={props.phase2Update}
                                originalStateGerrymandering={props.originalStateGerrymandering}
                                selectedStateGerrymandering={props.selectedStateGerrymandering}
                                phase2ControlsTabDisabled={phase2ControlsTabDisabled}
                                togglePhase2ControlsTabDisabled={togglePhase2ControlsTabDisabled}
                                togglePhase0ControlsTabDisabled={togglePhase0ControlsTabDisabled}
                                togglePhase1ControlsTabDisabled={togglePhase1ControlsTabDisabled}
                                handleDistrictToggleDisabled={handleDistrictToggleDisabled}
                                restartPhase0Tab={restartPhase0Tab}/>
            </TabPanel>
            <TabPanel value={value} index={3}>
                <DataDisplay stateData={props.stateData} precinctData={props.precinctData}
                             districtData={props.districtData}
                             chosenState={props.chosenState}
                             loadOriginalDistricts={props.loadOriginalDistricts}
                             removeOriginalDistricts={props.removeOriginalDisrtricts}
                             demographicMapUpdate={props.demographicMapUpdate}
                             demographicMapUpdateSelection={props.demographicMapUpdateSelection}
                             election={props.election} districtToggleDisabled={districtToggleDisabled}/>
            </TabPanel>
        </div>
    );
}