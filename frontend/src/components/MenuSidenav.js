import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Phase0Controls from "./Phase0Controls";
import Phase1Controls from "./Phase1Controls";
import Phase2Controls from "./Phase2Controls";
import DataDisplay from "./DataDisplay";

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`scrollable-auto-tabpanel-${index}`}
            aria-labelledby={`scrollable-auto-tab-${index}`}
            {...other}
        >
            <Box p={3}>{children}</Box>
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
        width: '6.5vw',
        minWidth: '6.5vw',
        justifyContent: 'center',
        itemAlign: 'center'
    },
}))(props => <Tab {...props} />);

export default function MenuSidenav(props) {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div className={classes.root}>
            <AppBar position="static" style={{width:'29vw'}} color="default">
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    tabItemContainerStyle={{width: '5%'}}
                    contentContainerStyle={{  display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center', right: '10vw'}}
                    centered={true}
                >
                    <StyledTab label="Phase 0"></StyledTab>
                    <StyledTab label="Phase 1" />
                    <StyledTab label="Phase 2"/>
                    <StyledTab label="Data"/>
                </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>
                <Phase0Controls state={props.state}></Phase0Controls>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <Phase1Controls chosenState={props.chosenState}></Phase1Controls>
            </TabPanel>
            <TabPanel value={value} index={2}>
                <Phase2Controls></Phase2Controls>
            </TabPanel>
            <TabPanel value={value} index={3}>
                <DataDisplay stateData={props.stateData} precinctData={props.precinctData} districtData={props.districtData} chosenState={props.chosenState}></DataDisplay>
            </TabPanel>
        </div>
    );
}